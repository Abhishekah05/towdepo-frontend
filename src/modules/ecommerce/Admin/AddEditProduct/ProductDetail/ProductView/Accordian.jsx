import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";

export default function AccordionUsage() {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
         <h2>DELIVERY/PICKUP FAQS?</h2> 
        </AccordionSummary>
        <AccordionDetails style={{ fontSize: '24px' }} >
            <Typography>
          <b>Delivery address - commercial or residential?</b>D If the delivery address
          is <b>residential</b>, would you be open to arranging a pickup from a <b>nearby
          commercial address?</b>  A Budget Truck Tires representative will get in
          touch with you to discuss and agree on a convenient location, thus
          avoiding any additional surcharges imposed by freight companies for
          residential deliveries. <br />
          <b>Can you ship to a residential address?</b> Yes, we
          can. However, most LTL carriers will <b>upcharge at least $135</b>  and they
          will group all residential deliveries instead of shipping the next
          business day. This will <b>delay</b>  the delivery <b>for at least 1-2 business
          days</b> and generate additional delivery costs.
          
          <br /> <b>What are your shipping
          methods and how long do they take? </b> <br />
          – Some tires will be shipped via
          FedEx or UPS Ground. The majority of the tires we sell will be shipped
          via LTL due to their size and weight. <br /> – If shipped via ground service,
          you should receive your order within 2-3 business days after the order
          has been picked up by the carrier. <br /> – If shipped via LTL, you should
          receive your order within 3-5 business days after the order has been
          picked up by the carrier.
          <br />
          <b>Suggest buying optimal quantities for best
          deal</b>  Suggest buying optimal quantities for best deal <b>6-8 tires</b>  on a
          pallet, as round tires are definitely outside the box and remain
          palletized freight for the <b>best rates</b> . <br /> 
          
          <b>Local Pick Up Instructions:</b>
          Pick up hours are 10 am - 4pm (local time) Things to bring for pick
          up: <br />- Pick up / Order confirmation email <br />- Valid Driver's License 
          <br />
          The
          payment has to be processed and completed prior to pick up at any of
          our locations. The warehouses <b>do not</b>  handle any payment.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
