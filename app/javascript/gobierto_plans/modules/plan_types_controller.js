import Vue from "vue";
import { router } from "../webapp/lib/router";

Vue.config.productionTip = false;
Vue.config.devtools = true;

export class GobiertoPlansController {
  constructor(options = {}) {
    const selector = "gobierto-planification";

    // Mount Vue application
    const entryPoint = document.getElementById(selector);
    if (entryPoint) {
      const htmlRouterBlock = `
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      `;

      entryPoint.innerHTML = htmlRouterBlock;

      const { dataset: { baseurl, planId } } = entryPoint

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match#Using_named_capturing_groups
      const { groups: { slug, year } = {} } = baseurl.match(/planes\/(?<slug>.*)\/(?<year>.*)/)
      router.beforeEach((to, _, next) => {
        const { slug: s, year: y } = to.params
        // add slug & year to the $route.params from the baseurl, if they come empty
        if (!s || !y) next({ ...to, params: { ...to.params, slug, year } })
        else next()
      })

      new Vue({
        router,
        data: { ...options, baseurl, planId },
      }).$mount(entryPoint);
    }
  }
}