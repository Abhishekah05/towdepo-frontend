// src/components/CardWidget.js
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const CardWidget = ({ title, content }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
        borderRadius: 1,
        backgroundColor: "background.default",
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardWidget;
