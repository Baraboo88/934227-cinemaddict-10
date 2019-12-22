import AbstractComponent from './abstract-component';
import Chart from 'chart.js';
import chartjsPlugin from 'chartjs-plugin-datalabels';

Chart.defaults.global.plugins.datalabels.anchor = 'start';

const renderChart = () => {
  const ctx = document.querySelector(`.statistic__chart`).getContext('2d');
  const myChart = new Chart(ctx, {
    plugins: [chartjsPlugin],
    type: 'horizontalBar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          data: [12, 19, 3, 5, 10, 3],
          backgroundColor: '#ffe800',
          strokeColor:
            `#ffe800`,
          borderWidth: 1,
          order: -1,

        }
      ]
    },
    options: {
      maintainAspectRatio: false,
    responsive: true,
      plugins: {
           datalabels: {
        color: `#ffffff`,
        anchor: 'start',
        align: 'center',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
       
       }
      },
      legend: {
        display: false
    },
      scales: {
        xAxes: [{

              display: false
            
        }]
    }
    }
  });
}

const template = () => {
  return `<section class="statistic visually-hidden">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">22 <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">130 <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Sci-Fi</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  `;
};

export default class Stat extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return template();
  }

  renderChart() {
    renderChart();
  }
}
