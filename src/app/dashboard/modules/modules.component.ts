import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, UserData } from 'src/app/post/post.service';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { PagerService } from 'src/app/post/pager.service';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from 'src/app/post/post';
import { AddComponent } from '../add/add.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../delete/delete.component';
import { AccountCRUDComponent } from '../account-crud/account-crud.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  constructor(public postService: PostService,private _Activatedroute:ActivatedRoute
    ,public pagerService: PagerService, private dialog: MatDialog) { }

  OBJ_ID:any
  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.objects(params.get('id')); 
  });
  }

  public dataSource_ = new MatTableDataSource<Post[]>();
  doFilter(value: string) {
    this.dataSource_.filter = value.trim().toLocaleLowerCase();
  }

  map: any
  pages: any
  dataSource: any;
  objects(ID: any) {
    
    this.map = new Map<string, string>();
    this.map.set("1", "getfirstobject");
    this.map.set("2", "GetContact");
    this.map.set("3", "GetCampaigns");
    this.map.set("4", "GetLeads");

    window.sessionStorage.setItem("action ", this.map.get(ID));
    window.sessionStorage.setItem("OBJ_ID ", ID);

    let page = 10;
    let size = 1;

    var header = new HttpHeaders();
    header = header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');

    let parms = new HttpParams();
    parms = parms.append('action', '' + this.map.get(ID) + '')
      .append('from', '' + size + '').append('to', '' + page + '');
    this.postService.getAll(header, parms).pipe(map((userData: any) => this.getLEAD(this.dataSource = userData.items, this.pages = userData.meta.totalItems))
    ).subscribe();
  }

  columnNames: any[] = []
  getLEAD(data: any, pager: any) {
    
    this.columnNames = Object.keys(data[0]);
    this.columnNames.push('ACTION')
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  pageEvent!: PageEvent;
  pager: any = {};
  onPaginateChange(event: PageEvent) {
    //console.log("page..")
    let page = 0;
    page = event.pageIndex;

    this.pager = this.pagerService.getPager(event.length, page, event.pageSize);

    var header = new HttpHeaders();
    header = header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');

    let parms = new HttpParams();
    parms = parms.append('action', '' + window.sessionStorage.getItem("action ") + '')//.append('table', 'Account_Info')
      .append('from', '' + this.pager.startIndex + '').append('to', '' + this.pager.endIndex + '');

    this.postService.getAll(header, parms).subscribe((userData: UserData) => { this.dataSource = userData.items });

  }

  validate: any[] = []
  header: any = {}
  parms: any = {}
  redirectToAdd() {

    this.map = new Map<string, string>();
    this.map.set("1", "insertintoObject");
    this.map.set("2", "InsertContact");
    this.map.set("3", "InsertCampaigns");
    this.map.set("4", "InsertLeads");

    this.header = new HttpHeaders();
    this.header = this.header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');

    this.parms = new HttpParams();
    this.parms = this.parms.append('ObjectID', window.sessionStorage.getItem("OBJ_ID ")).append('action', '' + this.map.get(window.sessionStorage.getItem("OBJ_ID ")) + '')

    this.postService.validateFieldData(this.header, this.parms).subscribe((data: any) => {

      this.validate = data.SYS_FIELDS

      this.header = new HttpHeaders();
      this.header = this.header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');

      var parms = new HttpParams();
      parms = parms.append('action', '' + this.map.get(window.sessionStorage.getItem("OBJ_ID ")) + '')

      this.dialog.open(AddComponent, {
        data: { FieldDATA: this.validate, Header: this.header, Params: this.parms },
        height: '600px',
        width: '1300px',

      });
    })
  }

  redirectToDelete(row: any) {
    this.map = new Map<string, string>();
    this.map.set("1", "DeleteObject");
    this.map.set("2", "DeleteContact");
    this.map.set("3", "DeleteCampaigns");
    this.map.set("4", "DeleteLeads");
    this.header = new HttpHeaders();
    this.header = this.header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');

    this.parms = new HttpParams();
    this.parms = this.parms.append('action', ''+ this.map.get(window.sessionStorage.getItem("OBJ_ID "))+'')
    this.dialog.open(DeleteComponent, {
      data: { row, Header: this.header, Params: this.parms }
    });

  }

  validateData: any[] = []
  redirectToUpdate(row: any) {

    this.map = new Map<string, string>();
    this.map.set("1", "UpdateObject");
    this.map.set("2", "UpdateContact");
    this.map.set("3", "UpdateCampaigns");
    this.map.set("4", "UpdateLeads");

    this.header = new HttpHeaders();
    this.header = this.header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');
    this.parms = new HttpParams();
    this.parms = this.parms.append('ObjectID', ''+window.sessionStorage.getItem("OBJ_ID ")+'').append('action', ''+this.map.get(window.sessionStorage.getItem("OBJ_ID "))+'')

    this.postService.validateFieldData(this.header, this.parms).subscribe((data: any) => {
      this.validateData = data.SYS_FIELDS
      //console.log(this.validateData)

      this.header = new HttpHeaders();
      this.header = this.header.append('Authorization', '' + window.sessionStorage.getItem("TKN") + '');

      this.parms = new HttpParams();
      this.parms = this.parms.append('action', ''+this.map.get(window.sessionStorage.getItem("OBJ_ID "))+'')

      this.dialog.open(AccountCRUDComponent, {
        data: { row, FieldUPdate: this.validateData, Header: this.header, Params: this.parms }, height: '600px',
        width: '1300px',
      });
    })
  }
}
