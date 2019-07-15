
  //pie1//

var options = {  
    chart: {
    height: 300,
      type: 'pie',
    },
    
    colors:['#FF9E00', '#FF7474'],
    series: [158608, 35504],
    labels: ['% of children in sufficient areas', '% of children in insufficient areas']
  }
  
  var chart1 = new ApexCharts(document.querySelector("#chart1"), options);
  
  chart1.render();

//pie2//

  var options = {  
    chart: {
    //   width:500,
      height: 300,
      type: 'pie',
    },
    colors:['#FF9E00', '#FF7474'],
    series: [124384, 10461],
    labels: ['% of children in sufficient areas', '% of children in insufficient areas']
  }
  
  var chart2 = new ApexCharts(document.querySelector("#chart2"), options);
  
  chart2.render();


  //pie3//

var options = {  
    chart: {
      height:300,
      type: 'pie',
    },
    colors:['#81BB42', '#FF7474'],
    series: [163, 170],
    labels: ['Adequate Capacity Growth Areas','Insufficient  Capacity Growth Areas']
  }
  
  var chart3 = new ApexCharts(document.querySelector("#chart3"), options);
  
  chart3.render();

//pie4//

  var options = {  
    chart: {
      height:300,
      type: 'pie',
    },
    colors:['#81BB42', '#FF7474'],
    series: [167, 198],
    labels: ['Adequate Capacity Growth Areas','Insufficient  Capacity Growth Areas']
  }
  
  var chart4 = new ApexCharts(document.querySelector("#chart4"), options);
  
  chart4.render();