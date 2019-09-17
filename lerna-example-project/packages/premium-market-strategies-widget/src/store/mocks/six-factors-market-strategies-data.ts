export const sixFactorsMarketStrategies = {
  commodityName: "CORN",
  latestPublishDate: "2018-09-01T11:22:36.864Z",
  contentTexts: [
    {
      createdDate: "2019-02-05T11:22:36.864Z",
      name: "Strategies Snapshot",
      text: `
			CURRENT ASSESSMENT
			Corn prices are relatively cheap while futures spreads still lean slightly bearish. Noncommercial positions and the trend are neutral, while the seasonal influence points higher until May, making this a Type 4, neutral-bullish market.
			LOOKING AHEAD
			The remaining 50% of 2018 production will need to be stored as this is the time of year when prices are typically depressed. We will monitor through the winter and anticipate better selling opportunities no later than early June.
			DAILY NOTE
			December corn ended up 3/4 cent Friday on increased volume. The trend in corn remains sideways.
			RECOMMENDATIONS
			There are no new recommendations at this time. See the Historical Recap below to review past recommendations.
		`,
    },
    {
      createdDate: "2018-10-12T11:22:36.864Z",
      name: "Historical Recap",
      text: `
			(10/12/18)
			2018-19:
			For those that have already forward contracted 50% of their 2018 corn production, buy July 2019 $3.40 corn puts, priced near 1 3/4 cents to provide downside risk protection for the other 50% of production, which will be stored after harvest. This cheap protection gives a chance to benefit from cash corn's seasonal tendency to trade higher until early June.
			For those that hedged 50% of their corn production with December futures contracts, buy back the futures contracts at thi: time (filled at $3.73) and then buy July 2019 $3.40 corn puts for 100% of your production (filled at 1 3/4 cents), which will be stored after harvest. Work with your broker to avoid a bad fill, but get the puts bought for the same reason described above.
			The statements above also recognize that you may have had to adjust your estimated production due to this fall's harvest difficulties.
			(6/14/18)
			2017-18
			The July 2018 corn futures were covered at $3.76 1/2 for a gain of 12 1/2 cents on 100% of production. Cash sales were made with July 2018 corn near $3.76 1/2. The option spread, originally bought at a net cost of 8 cents was closed at a 6 1/2 cents credit for a net loss of 1 1/2 cents. Overall, all positions closed out on June 13 added a net gain of 11 cents to 100% of 2017 production.
			(6/13/18)
			2017-18:
			For those that were short July 2018 futures contracts as a way of pricing 2017 production needs, exit all the July futures positions and make cash sales at this time to finish out the season. Also, work with your broker to exit the outstanding option positions in corn as they are no longer needed with the seasonal influence in corn prices now pointed lower. The two open option positions were long a July 2018 $3.70 corn call and short a short-dated July 2018 $4.10 corn call (note the short-dated call is based on the new-crop price and is NOT the same as a regular call option). The result of Wednesday's recommendation is that 2017 corn production has been fully sold and there is no more to do there.
			(06/04/18)
			2017-18
			100% of the crop has been priced or hedged with July 2018 futures at $3.89, and those sales covered with a call option spread that included buying July 2018 call options at a cost of $0.08. This puts the futures floor at $3.81, with national average basis at the time roughly 66 cents under the July futures contract. Since then, national average basis versus the July has strengthened to 39 cents under for a hedge gain of 27 cents. The July 370 call closed this past week at $0.22.
			2018-19
			25% of expected 2018 production was forward contracted (cash) or hedged (futures) using the December 2018 futures contract at a price of $4.04 on March 5, 2018. Another 25% when the December 2018 futures contract hit $4.17 on April 30, 2018. This has the position 50% of expected production priced at an average of approximately $4.10.
			(BE)
		`,
    },
  ],
  indicators: [
    {
      description: "string",
      id: "string",
      type: "string",
    },
  ],
  positions: [
    {
      periodTitle: "2017 Crop",
      description: "December 2017 Futures",
      averagePrice: "4.00",
      averagePriceDate: "Jul 18",
      details: [
        {
          dateString: "2017-02-19T11:22:36.864Z",
          percentage: 25,
          price: "string",
          type: "Sold",
        },
        {
          dateString: "2017-06-18T11:22:36.864Z",
          percentage: 25,
          price: "string",
          type: "Sold",
        },
        {
          dateString: "2017-11-17T11:22:36.864Z",
          percentage: 50,
          price: "string",
          type: "Sold",
        },
      ],
      footerNote: "string",
      lastUpdatedString: "1/18/2017 or January 18",
      newRecommendationDateString: "1/18/2017 or January 18",
    },
    {
      periodTitle: "2018 Crop",
      description: "December 2018 Futures",
      averagePrice: "4.10 ",
      averagePriceDate: "Dec 18",
      details: [
        {
          dateString: "2018-05-03T11:22:36.864Z",
          percentage: 25,
          price: "string",
          type: "Sold",
        },
        {
          dateString: "2018-04-30T11:22:36.864Z",
          percentage: 25,
          price: "string",
          type: "Sold",
        },
      ],
      footerNote: "string",
      lastUpdatedString: "1/18/2017 or January 18",
      newRecommendationDateString: "1/18/2017 or January 18",
    },
  ],
  charts: [
    {
      chartId: "1",
      title: "DTN Corn Trend",
    },
    {
      chartId: "2",
      title: "DTN Corn Noncommercial Outlook",
    },
    {
      chartId: "3",
      title: "DTN Corn Commercial Outlook",
    },
    {
      chartId: "4",
      title: "DTN Corn Seasonal Index",
    },
    {
      chartId: "5",
      title: "DTN Corn Price Probability",
    },
    {
      chartId: "6",
      title: "DTN Corn Volatility",
    },
  ],
};
