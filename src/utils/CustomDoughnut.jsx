
import React from "react";
import { Box, Typography } from "@mui/material";

const CustomDoughnut = ({ data, backgroundColors, genre ,colour}) => {

  const filteredData = data
    .map((value, index) => value > 0 ? { value, index } : null)
    .filter(item => item !== null);

  const total = filteredData.reduce((acc, curr) => acc + curr.value, 0);
  console.log("Total= " + total);
  console.log("Filtered Data= " + filteredData);


  const radius = 40;
  const innerRadius = 31;

  const getPathData = (startAngle, endAngle) => {
    const x1 = 50 + radius * Math.cos((Math.PI / 180) * startAngle);
    const y1 = 50 + radius * Math.sin((Math.PI / 180) * startAngle);
    const x2 = 50 + radius * Math.cos((Math.PI / 180) * endAngle);
    const y2 = 50 + radius * Math.sin((Math.PI / 180) * endAngle);
    const x3 = 50 + innerRadius * Math.cos((Math.PI / 180) * endAngle);
    const y3 = 50 + innerRadius * Math.sin((Math.PI / 180) * endAngle);
    const x4 = 50 + innerRadius * Math.cos((Math.PI / 180) * startAngle);
    const y4 = 50 + innerRadius * Math.sin((Math.PI / 180) * startAngle);

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${x2} ${y2} 
            L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 0 ${x4} ${y4} Z`;
  };

  return (
    <Box position="relative" width="100%" height="auto">
      <svg viewBox="-30 10 140 90" xmlns="http://www.w3.org/2000/svg" width="100%" height="80%">
        {total === 0 ? (
   
          <>
            <path
              d={getPathData(0.001, 360)}
              fill="tomato"
            />
           
           
          </>
        ) : (
        
          filteredData.map((item, idx) => {
            const { value, index } = item;
            const startAngle = idx === 0 ? 0 : filteredData.slice(0, idx).reduce((acc, curr) => acc + curr.value, 0) / total * 360;
            const endAngle = (filteredData.slice(0, idx + 1).reduce((acc, curr) => acc + curr.value, 0) / total) * 360;

            return (
              <React.Fragment key={index}>
                <path
                  d={getPathData(startAngle, endAngle)}
                  fill={backgroundColors[index]}
                />
                <text x={50 + (innerRadius + (radius - innerRadius) / 2) * Math.cos((Math.PI / 180) * (startAngle + (endAngle - startAngle) / 2))}
                      y={50 + (innerRadius + (radius - innerRadius) / 2) * Math.sin((Math.PI / 180) * (startAngle + (endAngle - startAngle) / 2))}
                      dominantBaseline="middle" textAnchor="middle" fill="black" fontSize="3">
                  {(value / total * 100).toFixed(1) + "%"}
                </text>
              </React.Fragment>
            );
          })
        )}
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fill={colour} fontSize="10">
          {genre}
        </text>
        
      </svg>
    </Box>
  );
};

export default CustomDoughnut;
