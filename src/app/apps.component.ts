import { Component, OnInit } from '@angular/core';
import { ApiService, AuthService, EnvService } from 'sb-shared-lib';


@Component({
    selector: 'apps',
    templateUrl: 'apps.component.html',
    styleUrls: ['apps.component.scss']
})
export class AppsComponent implements OnInit {

    public user: any = {};
    public user_apps: string[];

    public array: any;
    public apps: any;
    public url_brand_logo: string;

    constructor(
            private auth: AuthService,
            private api: ApiService,
            private env: EnvService
        ) {
    }


    public async ngOnInit() {
        try {
            this.apps = await this.api.fetch("/?get=config_live_apps");
        }
        catch(response) {
            console.warn('unable to retrieve installed apps', response);
        }

        try {
            const environment = await this.env.getEnv();
            // #memo - env has a default app_logo_url, so we should always get a value
            this.url_brand_logo = environment.app_logo_url;
        }
        catch(response) {
            console.warn('unable to retrieve brand logo', response);
        }

        this.auth.getObservable().subscribe( (user:any) => {
                this.user_apps = [];
                this.user = user;
            });
    }

    public getApps() {
        if(this.apps) {
            return Object?.keys(this.apps);
        }
        else {
            return [];
        }
    }

    public getColor(app: string) {
        let color: string = '#b0b0b0';
        if(this.apps.hasOwnProperty(app) && this.apps[app].hasOwnProperty('color') && this.apps[app].color.length) {
            color = this.apps[app].color;
        }
        return color;
    }

    public getTextColor(app: string) {
        let text_color: string = '#ffffff';
        if(this.apps.hasOwnProperty(app) && this.apps[app].hasOwnProperty('text_color') && this.apps[app].text_color.length) {
            text_color = this.apps[app].text_color;
        }
        return text_color;
    }

    public getUserName() {
        if(this.user.hasOwnProperty('name') && this.user.hasOwnProperty('login')) {
            return this.user.name + ' (' + this.user.login + ')';
        }
        return '';
    }

    public isGranted(app_name:string) {
        let app = this.apps[app_name];
        if(app.access?.groups && app.show_in_apps) {
            for(let group of app.access.groups) {
                if(this.auth.hasGroup(group)) {
                    return true;
                }
            }
        }
        return false;
    }

    public onSelect(app: any) {
        if(this.apps.hasOwnProperty(app)  && this.apps[app].hasOwnProperty('url')) {
            window.location.href = this.apps[app].url;
        }
    }

    public async onclickDisconnect() {
        try {
            await this.auth.signOut();
            setTimeout( () => {
                window.location.href = '/auth';
            }, 500);
        }
        catch(err) {
            console.warn('unable to request signout');
        }
    }

}
