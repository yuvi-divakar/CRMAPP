import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PostService } from 'src/app/post/post.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

interface type {
  id: string;
  value: string;
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
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-account-crud',
  templateUrl: './account-crud.component.html',
  styleUrls: ['./account-crud.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class AccountCRUDComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AccountCRUDComponent>, public postService: PostService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,) { }


  @ViewChild('myCheckbox') myCheckbox: any;
  date = new FormControl(moment().format("YYYY-MM-DD"));

  public active = [{ id: '1', value: 'None' },
  { id: '2', value: 'Yes' },
  { id: '3', value: 'No' }];

  active_: any[] = this.active

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  dynamicForm!: FormGroup;

  ngOnInit(): void {
    console.log("update")

    this.dynamicForm = this.fb.group({});
    this.field_validationData()

  }


  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';

  }

  submit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  str: string = "";
  formdata: any[] = []
  columnsValue: any[] = []
  saveEdit(): void {

    for (var i = 0; i < this.validateData.length; i++) {

      if (this.validateData[i].FIELD_TYPE.NAME === 'text' || this.validateData[i].FIELD_TYPE.NAME === 'Text Area' ||

        this.validateData[i].FIELD_TYPE.NAME === 'Relation-Search' || this.validateData[i].FIELD_TYPE.NAME === 'Relation-Dropdown') {
        this.formdata.push("\'" + this.data.row[this.validateData[i].DBNAME] + "\'")

      }
      else if (this.validateData[i].FIELD_TYPE.NAME === 'Date') {
        var date_ = this.dynamicForm.value[this.validateData[i].DBNAME]
       
        this.formdata.push('\'' + date_._i.year + '-' + date_._i.month + '-' + date_._i.date + '\'')

        //this.columnsData +='\''+this.dynamicForm.value.END_DATE._i.year+'-'+this.dynamicForm.value.END_DATE._i.month+'-'+this.dynamicForm.value.END_DATE._i.date+'\','
      }
      else if (this.validateData[i].FIELD_TYPE.NAME === 'Binary-Check box') {
        if (this.myCheckbox._checked) {
          this.formdata.push(1)
        }
        else
          this.formdata.push(0)
      }
      else
        this.formdata.push(this.data.row[this.validateData[i].DBNAME])
    }

    //console.log("update " + this.formdata)
    for (var i = 0, j = 0; i < this.validateData.length; i++, j++) {
      this.str += "" + this.validateData[i].DBNAME + "=" + this.formdata[j] + ","

    }

    type Details = { data: string, id: number, name: any };
    let update: Details = { data: this.str, id: this.data.row.ID, name: window.sessionStorage.getItem("User_ID ") }; // pass
    //console.log(update)
    this.postService.update(update, this.data.Header, this.data.Params);

    this.refreshPage();

  }
  refreshPage() {
    window.location.reload();
  }
  DBname: any[] = []
  DPname: any[] = []

  validateData: any[] = []
  field_validationData() {
    this.validateData = this.data.FieldUPdate
    //console.log(this.validateData)
    this.Create()

  }
  Create() {
    this.validateData.forEach((res: any) => {
      this.dynamicForm.addControl(res.DBNAME, new FormControl(''))
    });
    //console.log("form " + JSON.stringify(this.dynamicForm.value))
  }
}
