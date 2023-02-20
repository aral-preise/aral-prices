import Layout from '../components/layout.tsx';
import stations from '../stations.json' assert { type: 'json' };
import { Handlers, PageProps } from '$fresh/server.ts';
import { asset, Head } from '$fresh/runtime.ts';
import { Data, ger_facilities, ger_fuel, stationdata } from './data.ts';

export const handler: Handlers<Data> = {
	GET(req, ctx) {
		const url = new URL(req.url);
		const facilities: string[] = url.searchParams.getAll('facilities') ||
			[];
		const fuel: string[] = url.searchParams.getAll('fuel') || [];
		let query: string = url.searchParams.get('query') || '';
		query = query.toLocaleLowerCase();

		// we got everything to filter

		const results: stationdata[] = stations.filter((station) => (
			station.city.toLocaleLowerCase().includes(query) &&
			station.name.toLocaleLowerCase().includes(query) &&
			station.postcode.toLocaleLowerCase().includes(query) &&
			station.address.toLocaleLowerCase().includes(query) &&
			facilities.every((entry) => station.facilities.includes(entry)) &&
			fuel.every((entry) => station.products.includes(entry))
		));

		return ctx.render({ results, query, facilities, fuel });
	},
};

export default function Home({ data }: PageProps<Data>) {
	const { results, query, facilities, fuel } = data;
	return (
		<Layout>
			<Head>
				<meta
					name='description'
					content='Tankpreise für verschiedene Aral Tankstellen.'
				>
				</meta>
			</Head>
			<table class='header_table'>
				<tr>
					<td>
						<h1>Tankstellen: {Object.keys(stations).length}</h1>
					</td>
				</tr>
				<tr>
					<td>
						<form>
							<input
								type='text'
								name='query'
								placeholder='Stadt, Postleitzahl, Name, Straße'
								value={query ? query : ''}
							>
							</input>

							<select name='fuel' multiple>
								{ger_fuel.map(
									(element: string, index: number) => {
										if (fuel.includes(element)) {
											return (
												<option
													id={`${element}-${index}`}
													value={element}
													selected
												>
													{element}
												</option>
											);
										} else {
											return (
												<option
													id={`${element}-${index}`}
													value={element}
												>
													{element}
												</option>
											);
										}
									},
								)}
							</select>

							<select name='facilities' multiple>
								{Object.entries(ger_facilities).map(
									(
										element: [string, string],
										index: number,
									) => {
										if (facilities.includes(element[0])) {
											return (
												<option
													id={`${
														element[0]
													}-${index}`}
													value={element[0]}
													selected
												>
													{element[1]}
												</option>
											);
										} else {
											return (
												<option
													id={`${
														element[0]
													}-${index}`}
													value={element[0]}
												>
													{element[1]}
												</option>
											);
										}
									},
								)}
							</select>
							<input
								type='submit'
								value='suchen'
								class='wrapper'
							/>
						</form>
					</td>
				</tr>
			</table>
			<Head>
				<link rel='stylesheet' href={asset('/stationlist.css')} />
				<meta name='description' content={`Tankpreise für ${query}.`}>
				</meta>
			</Head>
			{(Object.keys(results).length > 0) && (
				<span>
					<table class='header_table'>
						<tr>
							<td>
								<h2>
									Ergebnisse: {Object.keys(results).length}
								</h2>
							</td>
						</tr>
					</table>
					<table class='stationlist'>
						<tr>
							<td>Postleitzahl</td>
							<td>Stadt</td>
							<td>Name</td>
						</tr>
						{results.map((station: stationdata) => (
							<tr
								onClick={`location.href="/station/${station.id}"`}
							>
								<td>{station.postcode}</td>
								<td>{station.city}</td>
								<td>{station.name}</td>
							</tr>
						))}
					</table>
				</span>
			)}
		</Layout>
	);
}
