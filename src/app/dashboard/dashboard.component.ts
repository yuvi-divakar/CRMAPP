import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService, UserData } from '../post/post.service';
import { map } from 'rxjs/operators';
import { AddComponent } from './add/add.component';
import { PageEvent } from '@angular/material/paginator';
import { PagerService } from '../post/pager.service';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from '../post/post';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(private http: HttpClient, public postService: PostService,
    private router: Router, private dialog: MatDialog, public pagerService: PagerService,
    private breakpointObserver: BreakpointObserver) { }

  action!: string;
  OBJ_ID!: string;

  sideBarOpen = true;
  Username = window.sessionStorage.getItem("User_ID ")
  USER_ID = window.sessionStorage.getItem("User_ID ")

  public dataSource_ = new MatTableDataSource<Post[]>();

  ngOnInit(): void {
   
  }
  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  setDataAction(act: any) {
    return this.action = act;

  }
  getDataAction() {
    return this.action;
  }
  setDataID(ID: any) {
    return this.action = ID;
  }
  getDataID() {
    return this.ID;
  }
  logout(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  doFilter(value: string) {
    this.dataSource_.filter = value.trim().toLocaleLowerCase();
  }

  PROCESS: any[] = []
  objectsTbl() {
    var tkn=window.sessionStorage.getItem("TKN");
    
    var header = new HttpHeaders();
    header = header.append('Authorization', '' +tkn + '');
    console.log(header)

    this.postService.getOBJ_TBL(header).pipe(map((OBJData: any) => this.PROCESS = OBJData.SYS_PROCESS)
    ).subscribe();
  }

  ID: any
  table: any
  dataSource: any;
  pages: any

  //public columnNames = ['ID', 'FIRST_NAME', 'ACCOUNT_NAME', 'COMPANY_NAME', 'TITLE', 'update', 'delete'];
  //columnNames:any
  objects(ID: any) {

    this.map = new Map<string, string>();
    this.map.set("1", "getfirstobject");
    this.map.set("2", "GetContact");
    this.map.set("3", "GetCampaigns");
    this.map.set("4", "GetLeads");

    this.setDataAction(this.map.get(ID))
    this.setDataID(ID)

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

  UPcolumnNames: any[] = []
  pagess: any
  columnNames: any[] = []
  MYcolumnNames: any[] = []

  getLEAD(data: any, pager: any) {

    this.postService.setUserData(data)
    //let obj = new LeadComponent(this.postService)
    //obj.getLEADS(data, pager)
    //this.pagess = pager
    //this.columnNames = Object.keys(data[0]);
    //this.columnNames.push('Update','Delete')

  }
 

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  pageEvent!: PageEvent;
  pager: any = {};
  onPaginateChange(event: PageEvent) {

    let page = 0;
    page = event.pageIndex;

    this.pager = this.pagerService.getPager(event.length, page, event.pageSize);

    var header = new HttpHeaders();
    header = header.append('Authorization', '' + window.sessionStorage.getItem("TKN ") + '');

    let parms = new HttpParams();
    parms = parms.append('action', '' + window.sessionStorage.getItem("action ") + '')//.append('table', 'Account_Info')
      .append('from', '' + this.pager.startIndex + '').append('to', '' + this.pager.endIndex + '');

    this.postService.getAll(header, parms).subscribe((userData: UserData) => { this.dataSource = userData.items });

  }
  map: any
 
}