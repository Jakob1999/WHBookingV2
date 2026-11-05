import Router from "express"
import { getOldTrips, getCommingTrips, getTrip } from "../controllers/expeditions"
import { applyForTrip } from "../controllers/apply"


const routes = Router()

routes.post("/trips", getCommingTrips)
routes.post("/oldTrips", getOldTrips)
routes.post("/trip", getTrip)
routes.post("/apply", applyForTrip)

export default routes