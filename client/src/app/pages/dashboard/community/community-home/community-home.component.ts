import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User, UsersService } from '../../../../@core/data/users.service';
import { Permission } from '../../../../@core/data/user.service';


@Component({
  selector: 'community',
  templateUrl: './community-home.component.html',
})

export class CommunityHomeComponent {
  @Output() onEditSuccess: EventEmitter<any> = new EventEmitter();
  alias: string = '';
  form = {
    id: '',
    avatarUrl: '',
    alias: '',
    createdAt: '',
    perms: {
      mapper: { checked: false, value: Permission.MAPPER },
      moderator: { checked: false, value: Permission.MODERATOR },
      admin: { checked: false, value: Permission.ADMIN },
      leaderboardBanned: { checked: false, value: Permission.BANNED_LEADERBOARDS },
      aliasBanned: { checked: false, value: Permission.BANNED_ALIAS },
      avatarBanned: { checked: false, value: Permission.BANNED_AVATAR },
    },
  };

  constructor(private activeModal: NgbActiveModal, private usersService: UsersService) { }

  loadUserData(userData) {
    Object.assign(this.form, userData);
    for (const perm in this.form.perms) {
      if (this.form.perms[perm].value & userData.permissions) {
        this.form.perms[perm].checked = true;
      }
    }
  }

  onSubmit() {
    const user = this.convertInputToUser();
    this.usersService.updateUser(user).subscribe(data => {
      user.createdAt = this.form.createdAt;
      user.updatedAt = new Date().toISOString();
      this.onEditSuccess.emit(user);
    }, error => {
      alert(error.message);
    });
  }

  convertInputToUser(): User {
    const user = {
      id: this.form.id,
      avatarUrl: this.form.avatarUrl,
      alias: this.form.alias,
      permissions: 0,
    };
    return user;
  }

  closeModal() {
    this.activeModal.close();
  }
}