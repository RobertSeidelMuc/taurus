import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { CookieService } from "ngx-cookie-service";



declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild("fixednav") fixednav;
  @ViewChild("tabs") tabs;
  @ViewChild("modal1") modal1;
  @ViewChild("modal2") modal2;
  title = 'taurus';
  sticky;
  scrolleddown = false;
  prevScrollpos;
  previousURL;
  breadcrumbSecond;
  success = false
  error = false
  errorMessage
  email
  password
  cookieMessage;
  cookieDismiss;
  cookieLinkText;
  public href: string = "";
  hasConsentedCookies;

  constructor(public auth: AuthService, public router: Router, private cookieService: CookieService) {
  }

  set setbreadcrumbSecond(string) {
    this.breadcrumbSecond = string;
  }

  async signUp() {
    const signUp = this.auth.emailSignUp(this.email, this.password)
    await signUp.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal2(), 2000)
      }
    ).catch(e => (this.error = true, this.errorMessage = e.message))
  }
  async signIn() {
    const signIn = this.auth.emailSignin(this.email, this.password)
    await signIn.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal1(), 2000)
      }
    )
      .catch(e => (this.error = true, this.errorMessage = e.message))

  }

  async googleLogin() {
    const signIn = this.auth.googleSignin()
    await signIn.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal1(), 2000)
        setTimeout(() => this.closeModal2(), 2000)
      }
    )
      .catch(e => (this.error = true, this.errorMessage = e.message))
  }
  async githubLogin() {
    const signIn = this.auth.googleSignin()
    await signIn.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal1(), 2000)
        setTimeout(() => this.closeModal2(), 2000)
      }
    )
      .catch(e => (this.error = true, this.errorMessage = e.message))
  }

  closeModal1() {
    var elem = this.modal1.nativeElement
    var modalInstance = M.Modal.getInstance(elem);
    modalInstance.close();
    this.success = false
  }
  closeModal2() {
    var elem = this.modal2.nativeElement
    var modalInstance = M.Modal.getInstance(elem);
    modalInstance.close();
    this.success = false
  }

  onScroll() {
    var currentScrollPos = window.pageYOffset;
    if (this.fixednav) {
      this.sticky = this.fixednav.nativeElement.offsetTop;
      if (this.prevScrollpos < currentScrollPos) {
        this.scrolleddown = true;
      } else {
        this.scrolleddown = false;
      }
    }
    this.prevScrollpos = currentScrollPos;
  }

  ngOnInit(): void {
    this.previousURL = this.router.url;
    this.prevScrollpos = window.pageYOffset;
    const options = {};
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);

    //init Modal (Login/SignUp)
    var modalElems = document.querySelectorAll('.modal');
    var modalInstance = M.Modal.init(modalElems, options)

    //CookieConsenter
    this.hasConsentedCookies = this.cookieService.get('cookieconsent_status');
    const landingPage = this;
    let cc = window as any;
    cc.cookieconsent.initialise({
      palette: {
        popup: {
          background: "#164969"
        },
        button: {
          background: "#ffe000",
          text: "#164969"
        }
      },
      theme: "classic",
      onStatusChange: function (status) {
        if (this.hasConsented()) {
          landingPage.hasConsentedCookies = 'dismiss';
        } else {
        }
      },
      content: {
        message: 'Wir verwenden notwendige Cookies, um die Nutzerauthentifizierung und den Zugriff auf unsere Datenbank zu ermöglichen sowie die Stabilität unserer Website zu gewährleisten. Durch die Nutzung dieser Anwendung stimmen Sie der Verwendung von Cookies zu.',
        dismiss: 'Ich bin einverstanden.',
        link: 'Erfahren Sie mehr über unsere Datenschutzrichtlinien.',
        href: environment.Frontend + "/datenschutz"
      }

    });
  


  }
}
