import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from './model/file-handle';
import { PrintingMachine } from './model/printingmachine';
import { User } from './model/user';
import { PrintingMachineService } from './services/printingmachine.service';
import { UserService } from './services/user.service';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public user: User = new User;

  public static authToken: string;
  public static refreshToken: string;

  machineToBeAdded: PrintingMachine = {
    id: undefined,
    manufacturer: "",
    model: "",
    printingTechnique: "",
    printingUnits: "",
    hasPerfector: false,
    maxFormat: "",
    minFormat: "",
    impressionsPerHour: "",
    length: "",
    height: "",
    width: "",
    description: "",
    dateAdded: "",
    images: [],
    machineImages: [],
    imagesToBeDisplayed: []
  };

  public machines: PrintingMachine[] = [];

  public machineInfo: PrintingMachine = this.machineToBeAdded;

  constructor(private printingmachineservice: PrintingMachineService, private userService:UserService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getMachines();
  }

  public getMachines(): void {
    this.printingmachineservice.getMachines().subscribe(
      {
        next: (result: PrintingMachine[]) => {
          this.machines = result

          for(const machine of this.machines) {
            machine.imagesToBeDisplayed = [];
            for(const image of machine.machineImages) {
              machine.imagesToBeDisplayed.push(image.imageURL);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
        }
      }
    )
  }

  //Adding Machine
  public onAddMachine(addMachineForm: NgForm): void {


    document.getElementById('closeModalButton')?.click();

    const formValue = addMachineForm.value;

    this.machineToBeAdded.id = formValue.id,
    this.machineToBeAdded.manufacturer = formValue.machineManufacturer,
    this.machineToBeAdded.model = formValue.machineModel,
    this.machineToBeAdded.printingTechnique = formValue.machinePrintingTechnique,
    this.machineToBeAdded.printingUnits = formValue.machinePrintingUnits,
    this.machineToBeAdded.hasPerfector = formValue.machineHasPerfector,
    this.machineToBeAdded.maxFormat = formValue.machineMaxFormatHeight + ' x ' + formValue.machineMaxFormatWidth + ' mm',
    this.machineToBeAdded.minFormat = formValue.machineMinFormatHeight + ' x ' + formValue.machineMinFormatWidth + ' mm',
    this.machineToBeAdded.impressionsPerHour = formValue.machineImpressionsPerHour,
    this.machineToBeAdded.length = formValue.machineLength,
    this.machineToBeAdded.height = formValue.machineHeight,
    this.machineToBeAdded.width = formValue.machineWidth,
    this.machineToBeAdded.description = formValue.machineDescription,
    this.machineToBeAdded.dateAdded = ""

    const machineFormData = this.prepareFormData(this.machineToBeAdded);
    this.printingmachineservice.addMachine(machineFormData).subscribe(
      {
        next: (response: PrintingMachine) => {
          this.getMachines();
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
        }
      }
    );
    addMachineForm.reset();
    this.machineToBeAdded.images = [];
  }

  public onOpenModal(machine: PrintingMachine | undefined, mode: string): void {

    const container = document.getElementById('main');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addMachine');
    }
    else if (mode === 'update') {
      button.setAttribute('data-bs-target', '#updateMachine');
    }
    else if (mode === 'delete') {
      document.getElementById('machineInfoCloseButton')?.click();
      button.setAttribute('data-bs-target', '#deleteMachine');
    }
    else if (mode === 'login') {
      document.getElementById('machineInfoCloseButton')?.click();
      button.setAttribute('data-bs-target', '#loginModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onOpenInfoModal(machine: PrintingMachine) {

    const container = document.getElementById('main');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    button.setAttribute('data-bs-target', '#modalInfo');
    this.machineInfo = machine;
    container?.appendChild(button);
    button.click();
  }

  public deleteMachine(id: number | undefined) {
    this.printingmachineservice.deleteMachine(id).subscribe(
      {
        next: (response: any) => {
          console.log(response);
          this.getMachines();
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
        }
      }
    );
  }

  public searchMachines(key: string) {
    const results: PrintingMachine[] = [];
    for (const machine of this.machines) {
      if (
      machine.manufacturer.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      machine.model.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      machine.printingTechnique.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(machine);
      }
    }
    this.machines = results;
    if (results.length === 0 || !key) {
      this.getMachines();
    }
  }

  login(loginForm: NgForm) {
    //console.log("Form is submitted");
    //console.log(loginForm.value);
    //add to close button if login successful
    this.userService.login(loginForm.value).subscribe(
      {
        next: (response:any) => {
          this.user.setUserLoginStatus(true);
          this.user.setAuthToken(response.access_token);
          this.user.setRefreshToken(response.refresh_token);
          this.user.setUsername(loginForm.value.username);
          AppComponent.authToken= this.user.getAuthToken();
          AppComponent.refreshToken= this.user.getRefreshToken();
          this.userService.getRolesByUsername(this.user.getUsername()).subscribe(
            {
              next: (response:any) => {
                for(const role of response.roles) {
                  if (role.name == "ROLE_ADMIN") {
                    this.user.setIsUserAdmin(true);
                  }
                }
              }
            }
          );
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
        }
      }
    );
    document.getElementById('closeLoginModalButton')?.click();
  }

  logout() {
    this.user.setUserLoginStatus(false);
    this.user.setAuthToken("");
    this.user.setRefreshToken("");
    this.user.setUsername("");
    this.user.setUserRoles([]);
    this.user.setIsUserAdmin(false);
  }

  private prepareFormData(machine: PrintingMachine): FormData {
    const formData = new FormData();
    formData.append(
      'machine', new Blob([JSON.stringify(machine)],{type: 'application/json'})
    );

    for (var i = 0; i < machine.images.length; i++) {
      formData.append(
        'imageFile' , machine.images[i].file, machine.images[i].file.name

      )
    }
    return formData;
  }

  onFileSelected(event: any) {
    if(event.target.files) {
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        )
      }

      this.machineToBeAdded.images.push(fileHandle);

    }
  }

  public removeImage(i: number) {
    this.machineToBeAdded.images.splice(i, 1);
  }
}
