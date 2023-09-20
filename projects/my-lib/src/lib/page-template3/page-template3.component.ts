import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-page-template3',
  templateUrl: './page-template3.component.html',
  styleUrls: ['./page-template3.component.css']
})
export class PageTemplate3Component {
  @Input()OnDemand:any;
  @Input()ApiUrl:string="";
  @Input()IsTreeView:string="";
  @Input()MultiSelect:string="";

  Url1:string="";
  Url2:string="";
  ngOnInit(){
    // this.Url=this.ApiUrl;
   if(this.OnDemand==true)
   {
    this.Url1=this.ApiUrl;
   }
   else{
    this.Url2=this.ApiUrl;
   }
  }
}
