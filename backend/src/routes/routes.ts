import Router from "express"
import { getOldTrips, getCommingTrips, getTrip } from "../controllers/expeditions"


const routes = Router()

routes.post("/trips", getCommingTrips)
routes.post("/oldTrips", getOldTrips)
routes.post("/trip", getTrip)

export default routes