import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrintingMachine } from '../model/printingmachine';

@Injectable({
  providedIn: 'root'
})
export class PrintingMachineService {

  private serverUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  public getMachines(): Observable<PrintingMachine[]> {
    return this.http.get<PrintingMachine[]>(`${this.serverUrl}/machines/all`);
  }

  public addMachine(machine: FormData): Observable<PrintingMachine> {
    return this.http.post<PrintingMachine>(`${this.serverUrl}/machines/add`, machine);
  }

  public updateMachine(machine: PrintingMachine): Observable<PrintingMachine> {
    return this.http.put<PrintingMachine>(`${this.serverUrl}/machines/update`, machine);
  }

  public deleteMachine(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.serverUrl}/machines/delete/${id}`);
  }
}
