export type tripCardData = {
    id: string,
    title: string,
    startDate: Date,
    endDate: Date,
    startloc: string,
    endLoc: string,
    image: string,
    status: string,
}

export type remaindingTripData = {
    info: string,
    dayCost: number,
    sailText: string, 
    includeText: string, 
    skipperMail: string
}
