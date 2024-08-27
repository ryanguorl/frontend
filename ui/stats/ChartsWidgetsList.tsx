import { Box, Grid, Heading, List, ListItem, Skeleton } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { StatsChartsSection } from 'types/api/stats';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import IconSvg from 'ui/shared/IconSvg';

import ChartsLoadingErrorAlert from './ChartsLoadingErrorAlert';
import ChartWidgetContainer from './ChartWidgetContainer';
import config from 'configs/app';

type Props = {
  filterQuery: string;
  initialFilterQuery: string;
  isError: boolean;
  isPlaceholderData: boolean;
  charts?: Array<StatsChartsSection>;
  interval: StatsIntervalIds;
}

const ChartsWidgetsList = ({ filterQuery, isError, isPlaceholderData, charts, interval, initialFilterQuery }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = useState(false);
  const isAnyChartDisplayed = charts?.some((section) => section.charts.length > 0);
  const isEmptyChartList = Boolean(filterQuery) && !isAnyChartDisplayed;
  const sectionRef = React.useRef<HTMLUListElement | null>(null);

  const shouldScrollToSection = Boolean(initialFilterQuery);

  const localeMessages: any = {
    "Accounts": config.t()("Accounts"),
    "Transactions": config.t()("Transactions"),
    "Blocks": config.t()("Blocks"),
    "Tokens": config.t()("Tokens"),
    "Gas": config.t()("Gas"),
    "Contracts": config.t()("Contracts")
  }

  React.useEffect(() => {
    if (shouldScrollToSection) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ shouldScrollToSection ]);

  const homeStatsQuery = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const handleChartLoadingError = useCallback(
    () => setIsSomeChartLoadingError(true),
    [ setIsSomeChartLoadingError ]);

  if (isError) {
    return <ChartsLoadingErrorAlert/>;
  }

  if (isEmptyChartList) {
    return <EmptySearchResult text={ `Couldn${ apos }t find a chart that matches your filter query.` }/>;
  }

  return (
    <Box>
      { isSomeChartLoadingError && (
        <ChartsLoadingErrorAlert/>
      ) }

      <List ref={ sectionRef }>
        {
          charts?.map((section) => (
            <ListItem
              key={ section.id }
              mb={ 8 }
              _last={{
                marginBottom: 0,
              }}
            >
              <Skeleton isLoaded={ !isPlaceholderData } mb={ 4 } display="inline-flex" alignItems="center" columnGap={ 2 } id={ section.id }>
                <Heading size="md" id={ section.id }>
                  { localeMessages[section.title] }
                </Heading>
                { section.id === 'gas' && homeStatsQuery.data && homeStatsQuery.data.gas_prices && (
                  <GasInfoTooltip data={ homeStatsQuery.data } dataUpdatedAt={ homeStatsQuery.dataUpdatedAt }>
                    <IconSvg name="info" boxSize={ 5 } display="block" cursor="pointer" _hover={{ color: 'link_hovered' }}/>
                  </GasInfoTooltip>
                ) }
              </Skeleton>

              <Grid
                templateColumns={{ lg: 'repeat(2, minmax(0, 1fr))' }}
                gap={ 4 }
              >
                { section.charts.map((chart) => (
                  <ChartWidgetContainer
                    key={ chart.id }
                    id={ chart.id }
                    title={ chart.title }
                    description={ chart.description }
                    interval={ interval }
                    units={ chart.units || undefined }
                    isPlaceholderData={ isPlaceholderData }
                    onLoadingError={ handleChartLoadingError }
                  />
                )) }
              </Grid>
            </ListItem>
          ))
        }
      </List>
    </Box>
  );
};

export default ChartsWidgetsList;
