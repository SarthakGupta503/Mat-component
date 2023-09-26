import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent {

  @Input() searchboxText: string = '';
  searchText: string = '';  // Assign an initial value

  @Output() searchTextChanged = new EventEmitter<string>();

  search() {
    this.searchTextChanged.emit(this.searchText);
  }
  clearSearchText(){
    this.searchText='';
    this.search();
  }
}
