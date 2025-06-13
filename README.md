# PL Energy Dashboard

**Web-based Energy Dashboard for Poland**

Real-time visualization of Polish electricity production and consumption, featuring cross-border trade balance data using the ENTSO-E Transparency Data.
**Deployed:** [https://ddragula.github.io/energy-dashboard](https://ddragula.github.io/energy-dashboard)


## Libraries and Tools Used

This project leverages the following major libraries and tools for data visualization and API integration:

* **Highcharts Dashboards** – a declarative dashboard framework with built-in data management, synchronization, ready-made components and completely customizable options.
* **Highcharts Stock** – an advanced time-series charting library with built-in range selectors, navigator, and performance optimizations for large datasets.
* **ENTSO-E API** – the source of energy data for generation, consumption, and trade balance.

### Installation

```bash
git clone https://github.com/ddragula/energy-dashboard.git
cd energy-dashboard
npm install
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```


## License

This project is licensed under the MIT License. See the LICENSE file for details.
