export type tripType = {
    id: string,
    title: string,
    info: string,
    starDate: Date,
    endDate: Date,
    image: string,
    startLoc: string,
    endLoc: string,
    cost: number,
    status: "Open" | "Limited spaces" | "Full",
    sailText: string,
    includeText: string,
    skipperMail: string
}

export type remaindingTripData = {
    info: string,
    cost: number,
    student_cost: number,
    sailText: string, 
    includeText: string, 
    skipperMail: string
}
