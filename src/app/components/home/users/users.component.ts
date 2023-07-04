import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/models/pagination.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import {ToastrService} from "ngx-toastr";
import {Rol} from "../../../models/rol.model";
import {RolesService} from "../../../services/roles.service";
import * as moment from "moment";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  PAGE_DEFAULT = 1;
  PER_PAGE_DEFAULT = 10;

  public pagination: Pagination = {
    page: this.PAGE_DEFAULT,
    perPage: this.PER_PAGE_DEFAULT,
  };

  public users: User[] = [];

  public accion: string = "";

  public user: User = {
    roles: []
  };

  public search: string = "";

  public frmUser: FormGroup = {} as FormGroup;

  public rolList: Rol[] = [];
  public rolSelected: string = "";
  public idRemove: any = "";

  public enabled = false;
  public disabled = true;

  constructor(private userService: UserService,
    private rolesService: RolesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private authService: AuthService) { }

  ngOnInit() {

    //Validar rol
    const user: User = this.authService.userData;
    if (user.roles?.filter(per => (per == 'admin-users' || per === 'admin')).length === 0) {

      this.toastr.warning("Unauthorized");
      this.router.navigateByUrl('/home');

    } else {

      this.activatedRoute.queryParams
        .subscribe(params => {
          this.pagination.page = params["page"] ? params["page"] : this.PAGE_DEFAULT;
          this.pagination.perPage = params["perPage"] ? params["perPage"] : this.PER_PAGE_DEFAULT;
          this.getUsers();
        });
      this.frmUser = new FormGroup({
        name: new FormControl('', [Validators.maxLength(50)]),
        lastName: new FormControl('', [Validators.maxLength(80)]),
        displayName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        birthDate: new FormControl('', [Validators.maxLength(10)]),
        phoneNumber: new FormControl('', []),
        disabled: new FormControl('', [Validators.required]),
        num: new FormControl({value: '', disabled: true}, []),
        roles: new FormControl('')
      });
      this.initUser();
      this.getRoles();

    }
  }

  initUser() {
    this.user = {
      name: "",
      lastName: "",
      disabled: false,
      phoneNumber: "",
      birthDate: "",
      displayName: "",
      email: "",
      password: "",
      photoURL: "",
      roles: []
    };
  }

  getUsers() {
    if (!!this.search && this.search.length > 0) {
      this.pagination.search = this.search;
    }
    this.userService.getUsersList(this.pagination).then((pagination: any) => {
      this.pagination = pagination;
      this.users = pagination.list;
    }).catch(() => {
      this.toastr.error("Error getting list of users");
    });
  }

  getRoles() {
    this.rolesService.getRoles().then(roles => {
      this.rolList = roles;
    }).catch((error) => {
      this.toastr.error("Error getting list of roles");
    })
  }

  prevPage() {
    this.pagination.page = this.pagination.prevPage;
    this.changeUrl();
  }

  nextPage() {
    this.pagination.page = this.pagination.nextPage;
    this.changeUrl();
  }

  changeUrl(): void {
    this.router.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.pagination.page,
        perPage: this.pagination.perPage,
        search: this.search
      },
      queryParamsHandling: "merge",
      preserveFragment: true
    });
  }

  getUser(id: string): Promise<User>{
    return new Promise<User>((resolve, reject) => {
      this.userService.getUser(id).then((user: User) => {
        resolve(user);
      }).catch((error) => {
        reject(error);
        console.log(error);
        this.toastr.error("Error getting user to edit");
      });
    });
  }

  async abrirModal(modal: any, accion: string, user: User) {
    this.accion = accion;
    if (accion === "new") {
      this.initUser();
      this.frmUser.get('password')?.setValidators([Validators.required]);
      this.openModal(modal);
    } else if(accion === "edit") {
      let _id: any = user._id;
      this.getUser(_id).then((user: User) => {
        this.user = user;
        if (user.birthDate !== undefined && user.birthDate !== null && user.birthDate._seconds) {
          this.user.birthDate = moment.utc(user.birthDate._seconds*1000).format('YYYY-MM-DD');
        }
        this.frmUser.get('password')?.setValidators([]);
        this.openModal(modal);
      })
    } else if (this.accion === 'show') {
      let _id: any = user._id;
      this.getUser(_id).then((user: User) => {
        this.user = user;
        if (user.birthDate !== undefined && user.birthDate && user.birthDate._seconds) {
          this.user.birthDate = moment.utc(user.birthDate._seconds*1000).format('YYYY-MM-DD');
        }
        this.frmUser.disable();
        this.openModal(modal);
      })
    }
  }

  openModal(modal: any) {
    let config: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      size: "lg",
      backdrop : 'static',
      keyboard : false
    };

    this.modalService.open(modal, config).result.then((result) => {}, (reason) => {
      // Cuando se cierra la modal
      this.accion = "";
      this.initUser();
      this.frmUser.reset();
      this.frmUser.enable();
    });
  }

  abrirModalEliminar(modal: any, user: User) {
    this.idRemove = user._id;
    let config: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      size: "lg",
      backdrop : 'static',
      keyboard : false
    };
    this.modalService.open(modal, config).result.then((result) => {}, (reason) => {
      this.idRemove = "";
    });
  }

  eliminarUsuario() {
    this.userService.removeUser(this.idRemove).then(res => {
      this.modalService.dismissAll();
      this.toastr.success(res);
      setTimeout(() => {
        this.getUsers();
      }, 5000);
    }).catch(err => {
      this.toastr.error(err);
    })
  }

  guardarUsuario(): void {
    if (this.frmUser.valid) {
      if (this.user._id) {
        //Se actualiza
        this.userService.updateUser(this.user).then(res => {
          this.toastr.success("User was successfully updated");
          this.modalService.dismissAll();
          this.frmUser.reset();
          setTimeout(() => {
            this.getUsers();
          }, 3500);
        }).catch(error => {
          this.toastr.error("Error updating user");
          this.toastr.error(error.error.message);
        });
      } else {
        //Se genera uno nuevo
        let newUser: User = Object.assign({}, this.user);
        this.userService.createUser(newUser).then((resp: any) => {
          this.toastr.success("User was successfully created");
          this.frmUser.reset();
          //Se espera 3.5 segundos a que se publique en algolia para poder atcualizarse
          setTimeout(() => {
            this.getUsers();
          }, 3500);
          this.modalService.dismissAll();
        }).catch((error) => {
          this.toastr.error("Error creating user");
          this.toastr.error(error.error.message);
        });
      }
    } else {
      this.toastr.warning("Form is incomplete");
    }
  }

  agregarRol() {
    // Validar que no esté el rol agregado
    if (!this.user.roles?.includes(this.rolSelected)) {
      this.user.roles?.push(this.rolSelected);
    } else {
      this.toastr.warning("The role is already assigned");
    }
  }

  removeRole(role: string) {
    // Validar si esta el rol y eliminarlo
    if (this.user.roles!.includes(role)) {
      let index: any = this.user.roles?.indexOf(role);
      this.user.roles?.splice(index, 1);
    }
  }

  getAccionDisabled() {
    return this.accion === "show";
  }

  llenarDummyUser(): User {
    let user: User = {
      name: "Armando",
      lastName: "Hernández",
      displayName: "Mandos",
      email: "mandos@mail.com",
      password: "password",
      birthDate: "1996-11-12",
      phoneNumber: "4281034105",
      disabled: false
    }
    return user;
  }
}
