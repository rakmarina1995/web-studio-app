import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @ViewChild('popup') popup!: TemplateRef<ElementRef>
  dialogRef: MatDialogRef<any> | null = null

  constructor(private dialog: MatDialog) {
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.popup);
  }
  scrollInto(element: string) {
    setTimeout(()=>{
      document.getElementById(element)?.scrollIntoView({behavior: 'smooth'});
    },100);

  }
}
