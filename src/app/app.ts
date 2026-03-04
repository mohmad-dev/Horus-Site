import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNav } from "./components/navbar/main-nav/main-nav/main-nav";
import { Footer } from "./components/Footer/footer/footer";
import { Courses } from "./components/courses/courses/courses";
import { Instructors } from "./components/instructors/instructors/instructors";
import { Home } from "./components/home/home/home";
import { AboutGoals } from "./components/about/about-goals/about-goals";
import { LandingPage } from "./components/landingPage/landing-page/landing-page";

@Component({
  selector: 'app-root',
  imports: [MainNav, Footer, Home, Instructors, AboutGoals, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Horus-Site');
}
