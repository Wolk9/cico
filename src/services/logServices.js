// logService.js
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { findAllLogs } from "./logs";

export class LogService {
  static async getLogs(
    toBeDeletedId,
    selectedLog,
    userSelection,
    eventSelection
  ) {
    const logs = await findAllLogs();
    // Filter and sort the logs as required
    // ...

    return filteredLogs;
  }

  static async deleteLog(logId) {
    const docRef = doc(getFirestore(), "logs", logId);
    await deleteDoc(docRef);
  }
}
