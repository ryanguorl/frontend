import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { ADDRESS_INFO } from 'stubs/address';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import config from "configs/app";

interface Props {
  hash: string;
}

const TokenInstanceCreatorAddress = ({ hash }: Props) => {
  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: ADDRESS_INFO,
    },
  });

  if (addressQuery.isError) {
    return null;
  }

  if (!addressQuery.data?.creator_address_hash) {
    return null;
  }

  const localeMessages = {
    "Creator": config.t()("Creator")
  }

  const creatorAddress = {
    hash: addressQuery.data.creator_address_hash,
    is_contract: false,
    implementations: null,
  };

  return (
    <>
      <DetailsInfoItem.Label
        hint="Address that deployed this token contract"
        isLoading={ addressQuery.isPlaceholderData }
      >
        { localeMessages["Creator"] }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressEntity
          address={ creatorAddress }
          isLoading={ addressQuery.isPlaceholderData }
        />
      </DetailsInfoItem.Value>
    </>
  );
};

export default TokenInstanceCreatorAddress;
