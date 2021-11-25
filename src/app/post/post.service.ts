import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { Post } from './post';
import { catchError, map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from './notification.service';
//import { addModel } from '../dashboard/add/add.component';
import { MatTableDataSource } from '@angular/material/table';
//import * as CryptoJS from 'crypto-js';


export interface UserData {
  meta: {
    totalItems: number;
    itemCount: number;
    pageSize: number;
    totalPages: number;
    currentPage: number;
  }
  items: Post[],
};

@Injectable({
  providedIn: 'root'
})

export class PostService {
  Auth_form!: FormGroup;
  update_form!: FormGroup;
  delete_form!: FormGroup;
  add_form!: FormGroup;

  dataChange: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  dialogData: any;
  userData:any;
  constructor(private http: HttpClient,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder) {this.userData= {}; }
   
    setUserData(val: any){
      this.userData= val;
      
    }
    getUserData(){
      return this.userData;
    }
  //get data from database in account_info table
  getAll(header: any, parms: any): Observable<any> {

    this.Auth_form = this.formBuilder.group({
      Condition: 'ID>=100',
    });
    console.log(header)
    return this.http.post<any>('http://localhost/common/api/GetService', this.Auth_form.getRawValue(), { headers: header, params: parms })
      .pipe(
        map((userData: UserData) => userData),
        catchError(err => throwError(err)))
  }

  getOBJ_TBL(header: any) {
    
    //return this.http.get<any>('http://localhost/salesapp/api/objectData', { headers: header })
    return this.http.get<any>('http://localhost/common/api/object', { headers: header })
  }

  //update data to database in account_info table
  update(data: any, header: any, parms: any): Observable<any> {
    this.http.post('http://localhost/common/api/UpdateService', data, { responseType: 'text',headers: header, params: parms })
      .subscribe(data => {
        this.notificationService.success(data);
      });
    return data;
  }

  str: string = "";
  //insert data to account_info table in database  
  add(data: any, header: any, parms: any) {

    return this.http.post('http://localhost/common/api/InsertService', data, { responseType: 'text',headers: header, params: parms })
      .subscribe(data => {
        this.notificationService.success(data);
      });
  }

  // delete data from account_info table in database  
  delete(ID: any, header: any, parms: any): Observable<any> {

    this.delete_form = this.formBuilder.group({
      ID: '' + ID + '',
    });
    this.http.post('http://localhost/common/api/DeleteService', this.delete_form.getRawValue(), {responseType: 'text', headers: header, params: parms })
      .subscribe(data => {
        this.notificationService.success(data);
      });
    return ID;
  }

  //error_Handler
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  updateIssue(issue: Post): void {
    this.dialogData = issue;
  }


  columns(): Observable<any> {
    var header = new HttpHeaders();
    header = header.append('Authorization', '' + window.sessionStorage.getItem("TKN ") + '');
    return this.http.get('http://localhost/salesapp/api/get_Columns/service', { headers: header })
  }

  validateFieldData(header: any, parms: any): Observable<any> {

    return this.http.get('http://localhost/common/api/fields', { headers: header, params: parms })
  }

  industryData(user: any): Observable<any> {

    var header = new HttpHeaders();
    header = header.append('Authorization', '' + window.sessionStorage.getItem("TKN ") + '');
    return this.http.post('http://localhost/salesapp/api/GetIndustry/service', user, { headers: header })
  }

  selection(): Observable<any> {

    var header = new HttpHeaders();
    header = header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');
    return this.http.get('http://localhost/salesapp/api/selection/service', { headers: header })
  }

  /*encrypt(msg: string) {
    //will have this at C# as well.
    var pass = "secret";
    var keySize = 256;
    //random salt
    var salt = CryptoJS.lib.WordArray.random(16);
    // to generate key
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: 1000,
    });
    // random IV
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    //will attach link where you can find these
    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    //Convert Lib.WordArray to ByteArray so we can combine them like Concat
    var saltwords = this.wordArrayToByteArray(salt);
    var ivwords = this.wordArrayToByteArray(iv);
    var cryptedText = this.wordArrayToByteArray(encrypted.ciphertext);
    // combine everything together in ByteArray.
    var header = saltwords.concat(ivwords).concat(cryptedText);
    //Now convert to WordArray.
    var headerWords = this.byteArrayToWordArray(header);
    //Encode this to sent to server
    var encodedString = CryptoJS.enc.Base64.stringify(headerWords);

    return encodedString;
  }


  //Type Conversions
  wordArrayToByteArray(wordArray: any) {
    if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
      length = wordArray.sigBytes;
      wordArray = wordArray.words;
    }

    var result: any[] = [];
    var bytes;
    var i = 0;
    while (length > 0) {
      bytes = this.wordToByteArray(wordArray[i], Math.min(4, length));
      length -= bytes.length;
      result.push(bytes);
      i++;
    }
    return [].concat.apply([], result);
  }
  byteArrayToWordArray(ba: any) {
    var wa: any[] = [],
      i;
    for (i = 0; i < ba.length; i++) {
      wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
    }

    return CryptoJS.lib.WordArray.create(wa);
  }
  wordToByteArray(word: any, length: any) {
    var ba = [],
      xFF = 0xff;
    if (length > 0) ba.push(word >>> 24);
    if (length > 1) ba.push((word >>> 16) & xFF);
    if (length > 2) ba.push((word >>> 8) & xFF);
    if (length > 3) ba.push(word & xFF);

    return ba;
  }*/

}
