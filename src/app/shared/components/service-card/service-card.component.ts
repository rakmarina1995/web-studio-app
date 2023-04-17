import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent implements OnInit {
  @Input() service!: ServiceType;
  dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  createOrder() {
    this.dialogRef=this.dialog.open(this.popup);
  }
}
