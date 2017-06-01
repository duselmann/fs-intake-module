import { Component, OnInit } from '@angular/core';
import { Application } from '../../admin/application';
import { ApplicationService } from '../../admin/application.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-temporary-outfitters',
  templateUrl: './temporary-outfitters.component.html',
  styleUrls: ['./temporary-outfitters.component.scss']
})
export class TemporaryOutfittersComponent implements OnInit {

  apiErrors: any;
  application = new Application();
  forest = 'Mt. Baker-Snoqualmie National Forest';
  mode = 'Observable';
  submitted = false;

  constructor(private applicationService: ApplicationService, private router: Router) { }

  onSubmit(form) {
    if (!form.valid) {
      window.scroll(0, 0);
    } else {
      this.applicationService.create(this.application, '/special-uses/noncommericial/', true)
        .subscribe(
          (persistedApplication) => {
            this.router.navigate(['applications/submitted/' + persistedApplication.applicationId]);
          },
          (e: any) => {
            this.apiErrors =  e;
            window.scroll(0, 0);
          }
        );
    }
  }

  ngOnInit() {
    this.application.district = '11';
    this.application.region = '11';
    this.application.forest = '11';
    this.application.type = 'tempOutfitter';
    this.application.authorizingOfficerName = 'officer name';
    this.application.authorizingOfficerTitle = 'officer title';
    this.application.applicantInfo.primaryFirstName = 'first';
    this.application.applicantInfo.primaryLastName = 'last';
    this.application.applicantInfo.dayPhone.areaCode = '555';
    this.application.applicantInfo.dayPhone.prefix = '555';
    this.application.applicantInfo.dayPhone.number = '5555';
    this.application.applicantInfo.dayPhone.extension = '5';
    this.application.applicantInfo.eveningPhone.areaCode = '555';
    this.application.applicantInfo.eveningPhone.prefix = '555';
    this.application.applicantInfo.eveningPhone.number = '5555';
    this.application.applicantInfo.eveningPhone.extension = '5';
    this.application.applicantInfo.emailAddress = 'test@test.com';
    this.application.applicantInfo.primaryAddress.mailingAddress = '444 easy st';
    this.application.applicantInfo.primaryAddress.mailingAddress2 = 'apt #2';
    this.application.applicantInfo.primaryAddress.mailingCity = 'Madison';
    this.application.applicantInfo.primaryAddress.mailingState = 'WI';
    this.application.applicantInfo.primaryAddress.mailingZIP = '55555';
    this.application.applicantInfo.organizationName = 'organization name';
    this.application.applicantInfo.website = 'http://www.test.com';
    this.application.applicantInfo.orgType = 'Association';
    this.application.tempOutfittersFields.individualCitizen = true;
    this.application.tempOutfittersFields.smallBusiness = true;
    this.application.tempOutfittersFields.activityDescription = 'description of activity';
    this.application.tempOutfittersFields.advertisingURL = 'http://www.test.com';
    this.application.tempOutfittersFields.advertisingDescription = 'description';
    this.application.tempOutfittersFields.clientCharges = 'charges';
    this.application.tempOutfittersFields.experienceList = 'experiece list';
  }

}