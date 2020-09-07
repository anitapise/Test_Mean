import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';

declare var M: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ UserService ]
})
export class UserComponent implements OnInit {
	file_size_err: boolean = false;
	cheque_file: any = null;
  constructor( public userService: UserService ) { }

  ngOnInit(): void {
    this.resetForm();
    this.refreshUserList();
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.userService.selectedUser = {
      _id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      profile_pic: null,
      profile_file: null
    }
  }

  onSubmit(form: NgForm) {
    if (form.value._id == "") {
      this.userService.postUser(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshUserList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.userService.putUser(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshUserList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshUserList() {
    this.userService.getUserList().subscribe((res) => {
      this.userService.users = res as User[];
    });
  }

  onEdit(user: User) {
    this.userService.selectedUser = user;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.userService.deleteUser(_id).subscribe((res) => {
        this.refreshUserList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }
  
  //Function for uploading file
    readUrl(event) {
        if(event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                let url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);

            //Checking uploaded file contains only following formats:- 'jpeg', 'png', 'jpg'
            if(((event.target.files[0].type == "image/jpeg") || (event.target.files[0].type == "image/png")
                || (event.target.files[0].type == "image/jpg"))
                && (event.target.files[0].size < 2048000)) {
                this.cheque_file = event.target.files[0];
                this.file_size_err = false;
            }
            else {
                this.cheque_file = null;
                this.file_size_err = true;
            }
        }
    }

}
