import { SimpleCard } from "lib/visualizations";
import { Card } from "./card.js";

export class PerCapitaInvestmentCard extends Card {
  constructor(divClass, city_id, current_year) {
    super(divClass, current_year);

    this.url =
      window.populateData.endpoint +
      "/datasets/ds-inversion-por-habitante.json?sort_desc_by=date&with_metadata=true&limit=5&filter_by_municipality_id=" +
      city_id +
      "&date_date_range=20100101-" +
      this.currentYear +
      "1231";
  }

  getData() {
    var data = this.handlePromise(this.url);

    data.then(jsonData => {
      var value = jsonData.data[0].value;
      new SimpleCard(this.container, jsonData, value, "per_capita_investment");
    });
  }
}
