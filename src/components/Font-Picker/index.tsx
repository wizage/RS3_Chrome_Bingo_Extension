import {
	Category,
	Font,
	FONT_FAMILY_DEFAULT,
	FontManager,
	Options,
	OPTIONS_DEFAULTS,
	Script,
	SortOption,
	Variant,
} from "@samuelmeuli/font-manager";
import { on } from "events";
import React, { KeyboardEvent, PureComponent, ReactElement } from "react";
import { SelectPicker } from 'rsuite';
import { Settings } from "../../types";

type LoadingStatus = "loading" | "finished" | "error";

interface Props {
	// Required props
	apiKey: string;
  updateFontFamily:(value: string) =>void;

	// Optional props
	activeFontFamily: string;
	onChange: (font: Font) => void;
	pickerId: string;
	families: string[];
	categories: Category[];
	scripts: Script[];
	variants: Variant[];
	filter: (font: Font) => boolean;
	limit: number;
	sort: SortOption;
}

interface State {
	loadingStatus: LoadingStatus;
}



export default class FontPicker extends PureComponent<Props, State> {
	// Instance of the FontManager class used for managing, downloading and applying fonts
	fontManager: FontManager;

	static defaultProps = {
		activeFontFamily: 'Bree Serif',
		onChange: (): void => {},
		pickerId: OPTIONS_DEFAULTS.pickerId,
		families: OPTIONS_DEFAULTS.families,
		categories: OPTIONS_DEFAULTS.categories,
		scripts: OPTIONS_DEFAULTS.scripts,
		variants: OPTIONS_DEFAULTS.variants,
		filter: OPTIONS_DEFAULTS.filter,
		limit: 250,
		sort: OPTIONS_DEFAULTS.sort,
	};

	state: Readonly<State> = {
		loadingStatus: "loading",
	};

	constructor(props: Props) {
		super(props);

		const {
			apiKey,
			activeFontFamily,
			pickerId,
			families,
			categories,
			scripts,
			variants,
			filter,
			limit,
			sort,
			onChange,
		} = this.props;

		const options: Options = {
			pickerId,
			families,
			categories,
			scripts,
			variants,
			filter,
			limit,
			sort,
		};

		// Initialize FontManager object
		this.fontManager = new FontManager(apiKey, activeFontFamily, options, onChange);
	}

	componentDidMount = (): void => {
		// Generate font list
		this.fontManager
			.init()
			.then((): void => {
				this.setState({
					loadingStatus: "finished",
				});
			})
			.catch((err: Error): void => {
				// On error: Log error message
				this.setState({
					loadingStatus: "error",
				});
				console.error("Error trying to fetch the list of available fonts");
				console.error(err);
			});
	};

	/**
	 * Set the specified font as the active font in the fontManager and update activeFontFamily in the
	 * state
	 */
	setActiveFontFamily = (activeFontFamily: string): void => {
		this.fontManager.setActiveFont(activeFontFamily);
	};



	render = (): ReactElement => {
		const { activeFontFamily, sort, updateFontFamily} = this.props;
		const { loadingStatus } = this.state;

		// Extract and sort font list
		const fonts = Array.from(this.fontManager.getFonts().values());
		if (sort === "alphabet") {
			fonts.sort((font1: Font, font2: Font): number => font1.family.localeCompare(font2.family));
		}
    const fontMap = fonts.map((font, index) => {
      return({value:font.family, label:font.family})
    });
    
    if (loadingStatus !== 'finished'){
      return (<SelectPicker block loading defaultValue={activeFontFamily} data={[{value:activeFontFamily, label:activeFontFamily}]} />)
    } else {
      return(<SelectPicker block data={fontMap} defaultValue={activeFontFamily} onChange={(value) => {
        if (value) {
          updateFontFamily(value);
          this.setActiveFontFamily(value);
        }
      }}/>)
    }
	};
}
