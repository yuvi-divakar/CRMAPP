import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NotificationService } from 'src/app/post/notification.service';
import { Post } from 'src/app/post/post';
import { PostService } from 'src/app/post/post.service';
import { MatRadioModule } from '@angular/material/radio';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';

interface type {
  id: string;
  value: string;
  section: string;
}

interface activee {
  id: string;
  value: string;
}
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class AddComponent implements OnInit {

  @ViewChild('myCheckbox') myCheckbox: any;
  date = new FormControl(moment().format("YYYY-MM-DD"));

  checked = false;
  fields: any;

  constructor(public dialogRef: MatDialogRef<AddComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Post, private changeDetector: ChangeDetectorRef,
    public postService: PostService, private notificationService: NotificationService, private datePipe: DatePipe) { }


  email = new FormControl('', [Validators.required, Validators.email]);


  public active = [{ id: '1', value: 'None' },
  { id: '2', value: 'Yes' },
  { id: '3', value: 'No' }];

  active_s: any[] = this.active

  dynamicForm!: FormGroup;

  ngOnInit(): void {

    this.dynamicForm = this.fb.group({});

    this.field_validationData()


  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  Create() {
    this.fields.FieldDATA.forEach((res: any) => {
      this.dynamicForm.addControl(res.DBNAME, new FormControl(''))
    });
    //console.log("form " + JSON.stringify(this.dynamicForm.value))
  }

  submit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  columnsData: string = "";

  confirmAdd() {

    for (var i = 0; i < this.fields.FieldDATA.length; i++) {

      if (this.fields.FieldDATA[i].FIELD_TYPE.NAME === 'text' || this.fields.FieldDATA[i].FIELD_TYPE.NAME === 'Text Area' ||
        this.fields.FieldDATA[i].FIELD_TYPE.NAME === 'Relation-Search' || this.fields.FieldDATA[i].FIELD_TYPE.NAME === 'Relation-Dropdown') {
        this.columnsData += '\'' + this.dynamicForm.value[this.fields.FieldDATA[i].DBNAME] + '\','
      }
      else if (this.fields.FieldDATA[i].FIELD_TYPE.NAME === 'Date') {
        var date_ = this.dynamicForm.value[this.fields.FieldDATA[i].DBNAME]

        this.columnsData += '\'' + date_._i.year + '-' + date_._i.month + '-' + date_._i.date + '\','

        //this.columnsData +='\''+this.dynamicForm.value.END_DATE._i.year+'-'+this.dynamicForm.value.END_DATE._i.month+'-'+this.dynamicForm.value.END_DATE._i.date+'\','
      }
      else if (this.fields.FieldDATA[i].FIELD_TYPE.NAME === 'Binary-Check box') {
        if (this.myCheckbox._checked) {
          this.columnsData += 1 + ','
        }
        else
          this.columnsData += 0 + ','
      }
      else
        this.columnsData += this.dynamicForm.value[this.fields.FieldDATA[i].DBNAME] + ','
    }


    type Details = { columnDATA: string, Name: any };
    let insert: Details = { columnDATA: this.columnsData.slice(0, -1), Name: window.sessionStorage.getItem("User_ID ") }; // pass
    //console.log(insert)
    this.postService.add(insert, this.fields.Header, this.fields.Params);
    this.refreshPage()
  }

  refreshPage() {
    window.location.reload();
  }

  field_validationData() {
    this.fields = this.data
    console.log(this.fields)
    this.Create()
  }

}
