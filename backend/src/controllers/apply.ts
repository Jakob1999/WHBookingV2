import { Request, Response } from "express";
import Mailjet from "node-mailjet";
import { sanityClient } from "./expeditions";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const applyForTrip = async (req: Request, res: Response) => {
    try {
        const { tripId, name, email, phone, student, organizer } = req.body ?? {};

        if (
            typeof tripId !== "string" ||
            typeof name !== "string" || name.trim().length < 2 || name.length > 100 ||
            typeof email !== "string" || !/^\S+@\S+$/.test(email) || email.length > 200 ||
            typeof phone !== "string" || !/^\d{8}$/.test(phone)
        ) {
            return res.status(400).json({ error: "Invalid application data" });
        }

        // The recipient comes from Sanity, never from the client.
        const trip = await sanityClient.fetch(
            `*[_type == "trip" && _id == $id][0] { title, startDate, skipperMail }`,
            { id: tripId }
        );

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }
        if (!trip.skipperMail) {
            return res.status(400).json({ error: "Trip has no contact email" });
        }

        const { MAILJET_API_KEY, MAILJET_API_SECRET, EMAIL_HOST_USER } = process.env;
        if (!MAILJET_API_KEY || !MAILJET_API_SECRET || !EMAIL_HOST_USER) {
            console.error("Mailjet environment variables are not configured");
            return res.status(500).json({ error: "Mail service not configured" });
        }

        const mailjet = new Mailjet({
            apiKey: MAILJET_API_KEY,
            apiSecret: MAILJET_API_SECRET
        });

        const senderName = "Wicked Horizon";
        const cleanName = name.trim();
        const isStudent = student === true;
        const isOrganizer = organizer === true;

        const textPart = [
            `New application for "${trip.title}"`,
            "",
            `Name: ${cleanName}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Student scholarship: ${isStudent ? "Yes" : "No"}`,
            `Wants to organize an expedition: ${isOrganizer ? "Yes" : "No"}`
        ].join("\n");

        const htmlPart = `
            <h3>New application for ${escapeHtml(String(trip.title))}</h3>
            <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Student scholarship:</strong> ${isStudent ? "Yes" : "No"}</p>
            <p><strong>Wants to organize an expedition:</strong> ${isOrganizer ? "Yes" : "No"}</p>
        `;

        await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: EMAIL_HOST_USER, Name: senderName },
                    To: [{ Email: trip.skipperMail }],
                    ReplyTo: { Email: email, Name: cleanName },
                    Subject: `New application: ${trip.title}`,
                    TextPart: textPart,
                    HTMLPart: htmlPart
                }
            ]
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to send application mail:", (error as Error).message);
        res.status(500).json({ error: "Failed to send application" });
    }
};
