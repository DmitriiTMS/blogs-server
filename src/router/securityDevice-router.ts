import { Router } from "express";
import { securityDeviceController } from "../controllers/securityDevice.controller";

export const securityDeviceRouter = Router();

securityDeviceRouter.get("/devices", securityDeviceController.getAllSessionDevices);
