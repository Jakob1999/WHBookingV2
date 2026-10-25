export type tripType = {
    id: string,
    title: string,
    info: string,
    starDate: Date,
    endDate: Date,
    image: string,
    startLoc: string,
    endLoc: string,
    dayCost: number,
    status: "Open" | "Limited spaces" | "Full",
    sailText: string,
    includeText: string,
    skipperMail: string
}

export type remaindingTripData = {
    info: string,
    dayCost: number,
    sailText: string, 
    includeText: string, 
    skipperMail: string
}
