import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';
import config from 'configs/app';

const FILE_TYPES = [ '.json' as const ];

const ContractVerificationVyperStandardInput = () => {
  return (
    <ContractVerificationMethod title={ config.t()('Contract verification via Vyper (standard JSON input)') }>
      <ContractVerificationFieldCompiler isVyper/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        title="Standard Input JSON"
        hint={ config.t()("Upload the standard input JSON file created during contract compilation") } 
        required
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperStandardInput);
