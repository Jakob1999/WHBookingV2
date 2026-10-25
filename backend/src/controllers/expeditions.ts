import { Request, Response } from "express";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { RequestWithId } from "../utils/request";
import { tripCardData } from "../types/tripTypes";

dotenv.config();

const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: process.env.SANITY_API_VERSION || "2026-08-16",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});

export const getCommingTrips = async(req: Request, res: Response) => {
    try {
        const limit = Number(req.body.limit) || 5;
        const offset = Number(req.body.offset) || 0;
        const end = offset + limit;

        const trips = await sanityClient.fetch(
            `*[_type == "trip" && dateTime(startDate) > dateTime(now())] | order(startDate asc) [$offset...$end] {
                _id,
                title,
                startDate,
                endDate,
                startLoc,
                endLoc,
                status,
                "image": image.asset->url
            }`,
            { offset, end }
        );

        const totalCount = await sanityClient.fetch(
            `count(*[_type == "trip" && dateTime(startDate) > dateTime(now())])`
        );

        const deserializedTrips: tripCardData[] = trips.map((trip: any) => ({
            id: trip._id as string,
            title: trip.title as string,
            startDate: new Date(trip.startDate),
            endDate: new Date(trip.endDate),
            startloc: trip.startLoc as string,
            endLoc: trip.endLoc as string,
            image: (trip.image as string) || "",
            status: trip.status as string
        }));

        res.json([deserializedTrips, totalCount]);
    } catch (err) {
        return res.status(500).json({
            error: (err as Error).message
        });
    }
}

export const getOldTrips = async(req: Request, res: Response) => {
    try {
        const limit = Number(req.body.limit) || 5;
        const offset = Number(req.body.offset) || 0;
        const end = offset + limit;

        const trips = await sanityClient.fetch(
            `*[_type == "trip" && dateTime(startDate) <= dateTime(now())] | order(startDate desc) [$offset...$end] {
                _id,
                title,
                startDate,
                endDate,
                startLoc,
                endLoc,
                status,
                "image": image.asset->url
            }`,
            { offset, end }
        );

        const totalCount = await sanityClient.fetch(
            `count(*[_type == "trip" && dateTime(startDate) <= dateTime(now())])`
        );

        const deserializedTrips: tripCardData[] = trips.map((trip: any) => ({
            id: trip._id as string,
            title: trip.title as string,
            startDate: new Date(trip.startDate),
            endDate: new Date(trip.endDate),
            startloc: trip.startLoc as string,
            endLoc: trip.endLoc as string,
            image: (trip.image as string) || "",
            status: trip.status as string,
        }));

        res.json([deserializedTrips, totalCount]);
    } catch (err) {
        return res.status(500).json({
            error: (err as Error).message
        });
    }
}

export const getTrip = async (req: RequestWithId, res: Response) => {
    try {
        const { id } = req.body;
        const trip = await sanityClient.fetch(
            `*[_type == "trip" && _id == $id][0] {
                info,
                dayCost,
                sailText,
                includeText,
                skipperMail,
                "boat": boat->{_id, name}
            }`,
            {
                id: String(id)
            }
        );

        if (!trip) {
            return res.status(400).json({ error: "Trip not found" });
        }

        res.json([trip]);
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({ error: 'Internal server error' });
    }
};



