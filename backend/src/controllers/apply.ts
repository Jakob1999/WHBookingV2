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

const formatDate = (value: unknown) => {
    const date = new Date(String(value));
    if (isNaN(date.getTime())) return String(value ?? "");
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
};

export const applyForTrip = async (req: Request, res: Response) => {
    try {
        const { tripId, name, email, phoneCode, phone, student } = req.body ?? {};

        if (
            typeof tripId !== "string" ||
            typeof name !== "string" || name.trim().length < 2 || name.length > 100 ||
            typeof email !== "string" || !/^\S+@\S+$/.test(email) || email.length > 200 ||
            typeof phoneCode !== "string" || !/^\+\d{1,4}$/.test(phoneCode) ||
            typeof phone !== "string" || !/^\d{4,14}$/.test(phone)
        ) {
            return res.status(400).json({ error: "Invalid application data" });
        }

        // The recipient comes from Sanity, never from the client.
        const trip = await sanityClient.fetch(
            `*[_type == "trip" && _id == $id][0] { title, startDate, endDate, startLoc, endLoc, skipperMail }`,
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
        const fullPhone = `${phoneCode} ${phone}`;
        const startDate = formatDate(trip.startDate);
        const endDate = formatDate(trip.endDate);

        const textPart = [
            `New application for "${trip.title}"`,
            `From: ${trip.startLoc} - ${startDate}`,
            `To: ${trip.endLoc} - ${endDate}`,
            "",
            `Name: ${cleanName}`,
            `Email: ${email}`,
            `Phone: ${fullPhone}`,
            `Student scholarship: ${isStudent ? "Yes" : "No"}`
        ].join("\n");

        const htmlPart = `
            <h3>New application for ${escapeHtml(String(trip.title))}</h3>
            <p><strong>From:</strong> ${escapeHtml(String(trip.startLoc ?? ""))} - ${escapeHtml(startDate)}</p>
            <p><strong>To:</strong> ${escapeHtml(String(trip.endLoc ?? ""))} - ${escapeHtml(endDate)}</p>
            <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(fullPhone)}</p>
            <p><strong>Student scholarship:</strong> ${isStudent ? "Yes" : "No"}</p>
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
