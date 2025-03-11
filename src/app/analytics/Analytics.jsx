import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { Messages } from 'primereact/messages';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

import { chartApiEndpoints } from './../../API';
import axios from './../../Axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

let messages;

const Analytics = (props) => {
  const [incomeExpenseCategoryId, setIncomeExpenseCategoryId] = useState(null);
  const [incomeExpenseCategories, setIncomeExpenseCategories] = useState([]);

  const [monthWiseChartData, setMonthWiseChartData] = useState({
    barChartData: {},
    barChartDataOptions: {},
    barChartDataLoading: true,
  });

  const [categoryWiseChartData, setCategoryWiseChartData] = useState({
    barChartData: {},
    barChartDataOptions: {},
    barChartDataLoading: false,
  });

  // Fetch the initial data for categories and month-wise chart
  useEffect(() => {
    requestIncomeExpenseCategories();
    requestMonthWiseChartData();
  }, []);

  // Fetch category-wise chart data whenever the selected category changes
  useEffect(() => {
    requestCategoryWiseChartData();
  }, [incomeExpenseCategoryId]);

  // Request for income and expense categories
  const requestIncomeExpenseCategories = () => {
    axios
      .get(chartApiEndpoints.incomeExpenseCategories)
      .then((response) => {
        if (response.data) {
          setIncomeExpenseCategories(response.data);
        } else {
          setIncomeExpenseCategories([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching income/expense categories:', error);
        setIncomeExpenseCategories([]);
      });
  };

  // Request for month-wise chart data
  const requestMonthWiseChartData = () => {
    axios
      .get(chartApiEndpoints.incomeExpenseMonthWise)
      .then((response) => {
        if (response.data && response.data.data) {
          setMonthWiseChartData({
            barChartData: response.data.data.barChartData,
            barChartDataOptions: response.data.data.options,
            barChartDataLoading: false,
          });
        } else {
          setMonthWiseChartData({
            ...monthWiseChartData,
            barChartDataLoading: false,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching month-wise chart data:', error);
        setMonthWiseChartData({ ...monthWiseChartData, barChartDataLoading: false });
      });
  };

  // Request category-wise chart data
  const requestCategoryWiseChartData = () => {
    if (incomeExpenseCategoryId) {
      setCategoryWiseChartData({ ...categoryWiseChartData, barChartDataLoading: true });
      axios
        .get(chartApiEndpoints.incomeExpenseCategoryWise, {
          params: { category_id: incomeExpenseCategoryId },
        })
        .then((response) => {
          if (response.data && response.data.data) {
            setCategoryWiseChartData({
              barChartData: response.data.data.barChartData,
              barChartDataOptions: response.data.data.options,
              barChartDataLoading: false,
            });
          } else {
            setCategoryWiseChartData({
              ...categoryWiseChartData,
              barChartDataLoading: false,
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching category-wise chart data:', error);
          setCategoryWiseChartData({ ...categoryWiseChartData, barChartDataLoading: false });
        });
    }
  };

  const handleCategoryChange = (e) => {
    console.log('Selected Category ID:', e.value);
    setIncomeExpenseCategoryId(e.value);
  };

  // Download data as Excel
  const downloadExcel = () => {
    const monthWiseData = monthWiseChartData.barChartData?.datasets?.map((dataset, datasetIndex) => {
      const type = datasetIndex === 0 ? 'Income' : 'Expense'; // Assuming the first dataset is for Income
      return dataset.data.map((value, index) => ({
        Month: monthWiseChartData.barChartData.labels[index],
        Type: type,
        Value: value,
      }));
    })?.flat();

    const categoryWiseData = categoryWiseChartData.barChartData?.datasets?.map((dataset) => {
      return dataset.data.map((value, index) => ({
        Category: categoryWiseChartData.barChartData.labels[index],
        Value: value,
      }));
    })?.flat();

    const workbook = XLSX.utils.book_new();

    if (monthWiseData?.length) {
      const monthWiseSheet = XLSX.utils.json_to_sheet(monthWiseData);
      XLSX.utils.book_append_sheet(workbook, monthWiseSheet, 'MonthWiseReport');
    }

    if (categoryWiseData?.length) {
      const categoryWiseSheet = XLSX.utils.json_to_sheet(categoryWiseData);
      XLSX.utils.book_append_sheet(workbook, categoryWiseSheet, 'CategoryWiseReport');
    }

    XLSX.writeFile(workbook, 'AnalyticsReport.xlsx');
  };

  // Download data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Analytics Report', 10, 10);

    // Month-wise chart data
    const monthWiseHeaders = [['Month', 'Type', 'Value']];
    const monthWiseData = monthWiseChartData.barChartData?.datasets?.map((dataset, datasetIndex) => {
      const type = datasetIndex === 0 ? 'Income' : 'Expense'; // Assuming the first dataset is for Income
      return dataset.data.map((value, index) => [
        monthWiseChartData.barChartData.labels[index],
        type,
        value,
      ]);
    })?.flat();

    if (monthWiseData?.length) {
      doc.text('Monthly Income & Expense', 10, 20);
      doc.autoTable({
        head: monthWiseHeaders,
        body: monthWiseData,
        startY: 25,
      });
    }

    // Category-wise chart data
    const categoryWiseHeaders = [['Category', 'Value']];
    const categoryWiseData = categoryWiseChartData.barChartData?.datasets?.map((dataset) => {
      return dataset.data.map((value, index) => [
        categoryWiseChartData.barChartData.labels[index],
        value,
      ]);
    })?.flat();

    if (categoryWiseData?.length) {
      const startY = doc.autoTable.previous.finalY + 10 || 30;
      doc.text('Category Wise Income/Expense', 10, startY);
      doc.autoTable({
        head: categoryWiseHeaders,
        body: categoryWiseData,
        startY: startY + 5,
      });
    }

    doc.save('AnalyticsReport.pdf');
  };

  return (
    <div>
      <Helmet title="Analytics" />

      <div className="p-grid p-nogutter">
        <div className="p-col-12">
          <div className="p-fluid">
            <Messages ref={(el) => (messages = el)} />
          </div>
        </div>
      </div>

      <div className="p-grid">
        <div className="p-col-12">
          <Card className="rounded-border">
            <div className="p-grid">
              <div className="p-col-9">
                <div className="p-card-title p-grid p-nogutter p-justify-between">Monthly Income & Expense Chart</div>
                <div className="p-card-subtitle">Glimpse of your incomes and expenses for a year.</div>
              </div>
              <div className="p-col-3" align="right">
                {monthWiseChartData.barChartDataLoading ? (
                  <ProgressSpinner style={{ height: '25px', width: '25px' }} strokeWidth={'4'} />
                ) : (
                  ''
                )}
              </div>
            </div>
            <br />
            <div>
              <Chart type="bar" data={monthWiseChartData.barChartData} options={monthWiseChartData.barChartDataOptions} />
            </div>
          </Card>
        </div>

        <div className="p-col-12">
          <Card className="rounded-border">
            <div className="p-grid">
              <div className="p-col-9">
                <div className="p-card-title p-grid p-nogutter p-justify-between">Category Wise Income & Expense Chart</div>
                <div className="p-card-subtitle">Glimpse of your incomes and expenses for a category.</div>
              </div>
              <div className="p-col-3" align="right">
                {categoryWiseChartData.barChartDataLoading ? (
                  <ProgressSpinner style={{ height: '25px', width: '25px' }} strokeWidth={'4'} />
                ) : (
                  ''
                )}
              </div>
            </div>
            <br />
            <div>
              <Dropdown
                onChange={handleCategoryChange}
                value={incomeExpenseCategoryId}
                itemTemplate={(option) => {
                  return option.category_name + ' (' + option.category_type + ')';
                }}
                filter={true}
                filterBy="category_name,category_type"
                filterPlaceholder="Search here"
                showClear={true}
                filterInputAutoFocus={false}
                options={incomeExpenseCategories}
                style={{ width: '100%' }}
                placeholder="Select an Income Expense Category"
                optionLabel="category_name"
                optionValue="id"
              />
            </div>
            <br />
            <div>
              <Chart type="bar" data={categoryWiseChartData.barChartData} options={categoryWiseChartData.barChartDataOptions} />
            </div>
            <br />
            <div className="p-d-flex p-jc-end">
              <Button label="Download Excel" icon="pi pi-file-excel" className="p-button-success p-mr-2" onClick={downloadExcel} />
              <Button label="Download PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={downloadPDF} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
};

export default React.memo(Analytics);
