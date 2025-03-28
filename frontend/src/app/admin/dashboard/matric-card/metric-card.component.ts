import {Component, Input} from '@angular/core';
import {Metric} from '../../model/dashboard.model';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ums-metric-card',
  standalone: false,
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {

  @Input() metric!: Metric
  protected faUsers = faUsers;

}
