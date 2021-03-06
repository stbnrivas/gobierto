<template>
  <div
    ref="table"
    class="gobierto-table"
  >
    <div class="gobierto-table__header">
      <slot name="title" />
      <template v-if="showColumnSelector">
        <slot
          name="columns"
        >
          <TableColumnsSelector
            :columns="mapColumns"
            @visible-columns="filterColumns"
          />
        </slot>
      </template>
    </div>
    <table>
      <thead>
        <template v-for="[id, { name, index, cssClass }] in arrayColumnsFiltered">
          <th
            :key="index"
            class="gobierto-table__th"
            :class="cssClass"
            @click="handleTableHeaderClick(id)"
          >
            {{ name }}
            <SortIcon
              v-if="currentSortColumn === id"
              :direction="getSorting(id)"
            />
          </th>
        </template>
      </thead>
      <tbody>
        <template
          v-for="(item, index) in dataTable"
        >
          <tr
            :key="index"
            :class="{ 'is-clickable': isRowClickable }"
            class="gobierto-table__tr"
            @click="isRowClickable ? onRowClick(item) : null"
          >
            <template v-for="[id, { name, index, type, cssClass }] in arrayColumnsFiltered">
              <template v-if="type === 'money'">
                <td
                  :key="id"
                  :class="cssClass"
                  class="gobierto-table__td"
                >
                  <span>
                    {{ item[id] | money }}
                  </span>
                </td>
              </template>
              <template v-else-if="type === 'date'">
                <td
                  :key="id"
                  :class="cssClass"
                  class="gobierto-table__td"
                >
                  <span>
                    {{ item[id] | date }}
                  </span>
                </td>
              </template>
              <template v-else-if="type === 'truncate'">
                <td
                  :key="id"
                  class="gobierto-table__td"
                >
                  <span :class="cssClass">
                    {{ item[id] }}
                  </span>
                </td>
              </template>
              <template v-else>
                <td
                  :key="id"
                  :class="cssClass"
                  class="gobierto-table__td"
                >
                  <span>{{ item[id] }}</span>
                </td>
              </template>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <template v-if="showPagination">
      <slot
        name="pagination"
        :show-data="updateData"
      >
        <Pagination
          :data="rowsSorted"
          :items-per-page="25"
          :container-pagination="'main'"
          @showData="updateData"
        />
      </slot>
    </template>
  </div>
</template>
<script>
import { Pagination } from "lib/vue/components"
import { VueFiltersMixin } from "lib/vue/filters"
import TableColumnsSelector from './TableColumnsSelector'
import SortIcon from './SortIcon'

export default {
  name: 'Table',
  components: {
    SortIcon,
    TableColumnsSelector,
    Pagination,
  },
  mixins: [VueFiltersMixin],
  defaults: {
    sortColumn: "id",
    sortDirection: "up",
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    orderColumn: {
      type: String,
      default: ''
    },
    showColumns: {
      type: Array,
      default: () => []
    },
    showColumnSelector: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    onRowClick: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      mapColumns: new Map(),
      currentSortColumn: this.orderColumn,
      currentSort: this.$options.defaults.sortDirection,
      visibleColumns: this.showColumns,
      dataTable: [],
      arrayColumnsFiltered: []
    };
  },
  computed: {
    tmpRows() {
      return this.data || []
    },
    rowsSorted() {
      const id = this.currentSortColumn;
      const sort = this.currentSort;
      return this.tmpRows
        .slice()
        .sort(({ [id]: termA }, { [id]: termB }) =>
          sort === "up"
            ? typeof termA === "string"
              ? termA.localeCompare(termB, undefined, { numeric: true })
              : termA > termB ? -1 : 1
            : typeof termA === "string"
              ? termB.localeCompare(termA, undefined, { numeric: true })
              : termA < termB ? -1 : 1
        );
    },
    icon() {
      return this.direction === 'down' ? 'down' : 'down-alt'
    },
    isRowClickable() {
      return !!this.onRowClick
    }
  },
  created() {
    this.prepareTable()
  },
  methods: {
    handleTableHeaderClick(id) {
      const { sort } = this.mapColumns.get(id);
      this.currentSortColumn = id;
      // toggle sort order
      this.currentSort = sort === "up" ? "down" : "up";
      // update the order for the item clicked
      this.mapColumns.set(id, { ...this.mapColumns.get(id), sort: this.currentSort });
    },
    getSorting(column) {
      // ignore the first item of the tuple
      const { sort } = this.mapColumns.get(column)
      return sort;
    },
    prepareTable() {
      this.mapColumns.clear();
      for (let index = 0; index < this.columns.length; index++) {
        const { field, name, type, cssClass = '' } = this.columns[index];
        this.mapColumns.set(field, {
          visibility: this.visibleColumns.includes(field),
          name: name,
          sort: undefined,
          type: type,
          cssClass: cssClass
        });
      }
      this.arrayColumnsFiltered = Array.from(this.mapColumns).filter(([,{ visibility }]) => !!visibility)
    },
    updateData(values) {
      this.dataTable = values
    },
    filterColumns(columns) {
      this.mapColumns = columns
      this.arrayColumnsFiltered = Array.from(this.mapColumns).filter(([,{ visibility }]) => !!visibility)
    }
  }
}
</script>
