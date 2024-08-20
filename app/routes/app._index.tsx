import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Thumbnail,
  Text,
  Icon,
  InlineStack,
  Button,
  TextField,
  Spinner,
} from "@shopify/polaris";
import React from "react";

import { getQRCodes } from "../models/QRCode.server";
import { AlertDiamondIcon, ImageIcon } from "@shopify/polaris-icons";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const qrCodes = await getQRCodes(session.shop, admin.graphql);
  return json({
    qrCodes
  });
}

const EmptyQRCodeState = ({ onAction }) => (
  <EmptyState
    heading="Create unique QR codes for your product"
    action={{
      content: "Create QR code",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow customers to scan codes and buy products using their phones.</p>
  </EmptyState>
);

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const QRTable = ({ qrCodes }) => (
  <IndexTable
    resourceName={{
      singular: "QR code",
      plural: "QR codes",
    }}
    itemCount={qrCodes.length}
    headings={[
      { title: "Thumbnail", hidden: true },
      { title: "Title" },
      { title: "Product" },
      { title: "Date created" },
      { title: "Scans" },
    ]}
    selectable={false}
  >
    {qrCodes.map((qrCode) => (
      <QRTableRow key={qrCode.id} qrCode={qrCode} />
    ))}
  </IndexTable>
);

const QRTableRow = ({ qrCode }) => (
  <IndexTable.Row id={qrCode.id} position={qrCode.id}>
    <IndexTable.Cell>
      <Thumbnail
        source={qrCode.productImage || ImageIcon}
        alt={qrCode.productTitle}
        size="small"
      />
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`qrcodes/${qrCode.id}`}>{truncate(qrCode.title)}</Link>
    </IndexTable.Cell>
    <IndexTable.Cell>
      {qrCode.productDeleted ? (
        <InlineStack align="start" gap="200">
          <span style={{ width: "20px" }}>
            <Icon source={AlertDiamondIcon} tone="critical" />
          </span>
          <Text tone="critical" as="span">
            product has been deleted
          </Text>
        </InlineStack>
      ) : (
        truncate(qrCode.productTitle)
      )}
    </IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(qrCode.createdAt).toDateString()}
    </IndexTable.Cell>
    <IndexTable.Cell>{qrCode.scans}</IndexTable.Cell>
  </IndexTable.Row>
);

export default function Index() {
  const { qrCodes } = useLoaderData();
  const navigate = useNavigate();
  const [twitterHandle, setTwitterHandle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    'use server'
    console.log(twitterHandle);
    if (twitterHandle) {
      setIsLoading(true);
      try {
        const success = setTimeout(() => {  return true; }, 2000);
        if (success) {
          setStatusMessage("Connection successful!");
          console.log(success); 

        } else {
          setStatusMessage("Connection failed. Please try again.");
        }
      } catch (error) {
        setStatusMessage("Connection failed. Please try again.");
          console.log(error); 
      } finally {
        setIsLoading(false);
      }
    } else {
      setStatusMessage("Please enter a Twitter handle");
    }
  };
 

  return (
    <Page>
      <ui-title-bar title="QR codes">
        <Button primary onClick={() => navigate("/app/qrcodes/new")}>
          Create QR code
        </Button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {qrCodes.length === 0 ? (
              <EmptyQRCodeState onAction={() => navigate("qrcodes/new")} />
            ) : (
              <QRTable qrCodes={qrCodes} />
            )}
          </Card>
        </Layout.Section>
        <Layout.Section>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width:"50%"
            }}
          >
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Add Twitter Feeds to Homepage
            </h1>
            <TextField
              value={twitterHandle}
              onChange={(value) => setTwitterHandle(value)}
              placeholder="Enter Twitter handle"
            />
            <Button onClick={handleConnect} loading={isLoading}>
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
            <div
              style={{
                marginTop: "10px",
                color: statusMessage.startsWith("Connection successful")
                  ? "green"
                  : "red",
              }}
            >
              {statusMessage}
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
