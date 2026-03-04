import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-details',
  imports: [RouterLink],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails {
  ngOnInit() {
    // * as section opened the scroll move to top of sec
    window.scrollTo(0, 0);
  }

}
