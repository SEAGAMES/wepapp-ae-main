<script>
//Importing Bar class from the vue-chartjs wrapper
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
//Exporting this so it can be used in other components
export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ["chartData"],
  data() {
    return {
      //Chart.js options that controls the appearance of the chart
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    //renderChart function renders the chart with the datacollection and options object.
    setTimeout(() => {
      this.renderChart(this.$store.getters.dataChartShow, this.options);
      console.log(this.$store.getters.dataChartShow);
    }, 100);
  }
};
</script>
