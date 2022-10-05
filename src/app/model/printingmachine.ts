import { FileHandle } from "./file-handle";

export interface PrintingMachine {

    id: number | undefined,
    manufacturer: string,
    model: string,
    printingTechnique: string,
    printingUnits: string,
    hasPerfector: boolean,
    maxFormat: string,
    minFormat: string,
    impressionsPerHour: string,
    length: string,
    height: string,
    width: string,
    description: string,
    dateAdded: string,
    images: FileHandle[]
    imagesToBeDisplayed: string[];
    machineImages: any;
}
