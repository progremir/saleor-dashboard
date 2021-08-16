import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import Savebar from "@saleor/components/Savebar";
import React from "react";

import GiftCardUpdateBalanceDialog from "./GiftCardUpdateBalanceDialog";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdateInfoCard from "./GiftCardUpdateInfoCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";
import useGiftCardDetails from "./providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "./providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import useGiftCardUpdate from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdate";
import useGiftCardUpdateForm from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";

const GiftCardUpdatePage: React.FC = () => {
  const { navigateBack } = useGiftCardUpdateDialogs();

  const {
    hasChanged,
    submit,
    data,
    handlers: { changeMetadata }
  } = useGiftCardUpdateForm();

  const {
    opts: { loading: loadingUpdate, status }
  } = useGiftCardUpdate();

  return (
    <Container>
      <GiftCardUpdatePageHeader />
      <Grid>
        <div>
          <GiftCardUpdateDetailsCard />
          <CardSpacer />
          <Metadata data={data} onChange={changeMetadata} />
        </div>
        <div>
          <GiftCardUpdateInfoCard />
        </div>
      </Grid>
      <Savebar
        state={status}
        disabled={loadingUpdate || !hasChanged}
        onCancel={navigateBack}
        onSubmit={submit}
      />
    </Container>
  );
};

export default GiftCardUpdatePage;