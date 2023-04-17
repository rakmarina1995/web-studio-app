import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ServiceType} from "../../../../types/service.type";
import {ServiceUtil} from "../../utils/service-util";
import {RequestType} from "../../../../types/request.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {ServiceService} from "../../services/service.service";

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  popupForm = this.fb.group({
    service: ['',],
    name: ['', [Validators.required, Validators.pattern(/^(?:[А-Я][а-яА-Я]+\s*)+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^(?:\+375)(?:29|33|44)[0-9]{7}$/)]],
  });
  formStatus: boolean = false;
  @Input() serviceValue: string = '';
  error: boolean = false;
  services: ServiceType[] = ServiceUtil.getServiceData();

  constructor(private fb: FormBuilder, private dialog: MatDialog,
              private serviceService: ServiceService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.popupForm.patchValue({service: this.serviceValue});
  }

  setService(name: string) {
    this.popupForm.patchValue({service: name});
  }

  createOrder() {
    if (this.popupForm.value.name && this.popupForm.value.phone) {
      let request = null;
      if (this.serviceValue) {
        request = this.serviceService.sendRequest({
          name: this.popupForm.value.name, phone: this.popupForm.value.phone,
          type: RequestType.order, service: this.popupForm.value.service ? this.popupForm.value.service : ''
        })
      } else {
        request = this.serviceService.sendRequest({
          name: this.popupForm.value.name, phone: this.popupForm.value.phone,
          type: RequestType.consultation
        })
      }
      request.subscribe({
        next: (data: DefaultResponseType) => {
          if (data.error && data.message) {
            this._snackBar.open(data.message);
            throw new Error(data.message);
          }
          this.formStatus = true;

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.error = true;
          throw new Error(errorResponse.error.message);
        }
      })
    }

  }

  closePopup() {
    this.dialog.closeAll();
  }
}
