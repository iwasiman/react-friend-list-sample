import React, {Component} from 'react';
import './App.css';
import logo from './logo.svg';

/**
 * お友達一覧を表示するReactコンポーネントです。
 * 基本のクラスコンポーネントを使っています。
 */
class App extends Component {
  /**
   * コンストラクタ。
   * React固有の初期化処理を行います。
   * @param {*} props プロップス
   */
  constructor(props) {
    console.log("** LifeCycle constructor() コールされたよ");
    super(props);
    //決まり文句。生成時にバインドする
    this.calcIsChecked = this.calcIsChecked.bind(this);
    this.handleChangeMultiCb = this.handleChangeMultiCb.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    // コンストラクタでStateを初期化
    this.state = {
      friendList: [], // お友達リスト
      cond_races: [], // ユニークな種族名の配列
      cond_checkedRaces: [], // チェックされた種族名の配列
      cond_name: "", // 絞り込みの名前
    };
    // mountされていないのにsetStateしようとするとここで警告になる。
  }

  /**
   * ライフサイクルメソッド：コンポーネントのマウント後
   * データ取得とステートへの保存を行います。
   */
  componentDidMount() {
    console.log("** LifeCycle componentDidMount() コールされたよ");
    // ここでsetStateすると再描画されてrender()がさらに呼ばれるので、本当はオーバーヘッドになるそうな。
    // サーバーからデータを取得してお友達リストをステートとして更新
    const friends = this.getFriendList();
    this.setState({
      friendList: friends,
    });
    // お友達の中の種族を算出してステートとして更新
    const condRaces = this.calcCondRaces(friends);
    this.setState({
      cond_races: condRaces,
    });
    // setStateは命令を出すだけなので、ここではまだ表示できないらしい。React DevToool で見られる。
    //console.log("@@ friendList", this.state);
  }

  /**
   * お友達一覧を取得します。
   * @returns Array お友達一覧の配列
   */
  getFriendList() {
    // サーバーのAPIと通信してJSON形式で一覧を取得...のつもりのダミー。
    const list = [
      {name: "シューちゃん", race: "ねこ"},
      {name: "ジェラトーニ", race: "ねこ"},
      {name: "クマたん", race: "くま"},
      {name: "クマすけ", race: "くま"},
      {name: "テディベア", race: "くま"},
      {name: "リボンのくまさん", race: "くま"},
      {name: "ハンさん", race: "ユニコーン"},
      {name: "ダンテさん", race: "ドラゴン"},
      {name: "スカイア", race: "ドラゴン"},
      {name: "きりんさん", race: "キリン"},
      {name: "あかねまる", race: "きつね"},
      {name: "ペネロペ", race: "コアラ"},
      {name: "エトワール", race: "うさぎ"},
      {name: "うさぴょん", race: "うさぎ"},
      {name: "ミミちゃん", race: "うさぎ"},
      {name: "おうまさん", race: "うま"},
      {name: "イケアくん", race: "くま"},
    ];
    return list;
  }

  /**
   * お友達一覧からユニークな種族の文字列リストを算出します。
   * @param {Array} friendsArray お友達リストの配列
   * @returns {Array} ユニークな種族の文字列配列
   */
  calcCondRaces(friendsArray) {
    let races = [];
    // オブジェクトから種族のプロパティだけを取り出す
    races = friendsArray.map((friend) => {
      return friend.race
    });
    // さらに重複を取り除く。もっとよいやり方あるかも。
    const uniqRaces = races.filter((value, index) => {
      return index === races.indexOf(value);
    });
    return uniqRaces;
  }

  /**
   * チェックボックス変更時のイベント処理を行います。
   * @param {SyntheticEvent} e イベント
   */
  handleChangeMultiCb(e) {
    // ステートで持っているチェックされた種族のリストを更新する。
    const checkedRaces = this.state.cond_checkedRaces;
    if (e.target.checked) {
      checkedRaces.push(e.target.value);
    } else {
      checkedRaces.splice(checkedRaces.indexOf(e.target.value), 1);
    }
    this.setState({
      cond_checkedRaces: checkedRaces,
    });
  }

  /**
   * テキストボックス変更時のイベント処理を行います。
   * @param {SyntheticEvent} e イベント
   */
  handleChangeText(e) {
    console.log("** handleChangeText in.", e.target.checked, e.target.value);
    this.setState({
      cond_name: e.target.value,
    })
  }

  /**
   * そのチェックボックスがチェックされているかを返します。
   * @param {String} value チェックボックスのvalue値
   * @returns {Boolean} true:チェックされている / チェックされていない
   */
  calcIsChecked(value) {
    if (this.state.cond_checkedRaces.indexOf(value) === -1) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 条件部分を描画します。内部メソッドです。
   * @returns {(JSX)} JSX形式のHTMLタグ部分
   */
  renderConditions() {
    //console.log("** renderCbs() in.");
    // アロー関数のmapで書いていったらJSX以外の変数は掛けなかったので、普通のループで実装
    const liStyle = {display: 'inline',};
    let checkBoxList = [];
    for (let i = 0; i < this.state.cond_races.length; i++) {
      let race = this.state.cond_races[i];
      // 配列にチェックボックス1件分のJSXを追加していく。
      // handleChangeMultiCbは handleChangeMultiCb()と書いてしまうと引数のeがとれなくなってエラーになる。
      checkBoxList.push(
        <li key={i} style={liStyle}>
          <input 
            type='checkbox'
            value={race}
            checked={this.calcIsChecked(race)}
            onChange={this.handleChangeMultiCb}
            name={i}
            id={i}
            />
          {race}
          &nbsp;
        </li>
      );
    }

    return (
      <div>
        名前で絞り込むよ:&nbsp;
         <input type="text" id="condName" name="condName" value={this.state.cond_name}
          onChange={this.handleChangeText} />
        <p>種族で絞り込むよ:</p>
        <ul>
          {checkBoxList}
        </ul>
      </div>
    );
  }

  /**
   * 画面を描画します。Reactのコンポーネントが必ず持っているメソッドです。
   * @returns {(JSX)} JSX形式のHTMLタグ部分
   */
  render() {
    console.log("** render() called.");
    // stateが更新されると、必ずこのrender()が呼ばれるのがReactの仕組み。
    return (
      <React.Fragment>
        <h1>お友達の一覧表示 with React</h1>
        {this.renderConditions()}
        <table border="1">
          <thead>
            <tr>
              <td width="200" style={{textAlign: "center"}}>なまえ</td>
              <td width="200" style={{textAlign: "center"}}>種族</td>
            </tr>
          </thead>
          <tbody>
            {this.renderFriendsList()}
          </tbody>
        </table>
        <div align="center">
          made with<br/>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </React.Fragment>
    );
  }

  /**
   * お友達1件が条件に合うかを判定して返します。
   * @param {Object} friend お友達1件のJSオブジェクト
   * @returns {Boolean} true: フィルタ条件に合致 / false: 合致しない
   */
  filterFunc(friend) {
    // もしもクラスコンポーネント直下の関数でなく、関数の中で関数オブジェクトとして定義した場合は、
    // this.state が効かない。その際はこの関数の引数でthisを別名で受け取り、そちらを使う必要がある。
    // テキストボックスの絞り込み
    let isTargetText = false;
    if (this.state.cond_name.length !== 0) {
      if (friend.name.indexOf(this.state.cond_name) !== -1) {
        isTargetText = true;
      }
    } else {
      isTargetText = true;
    }

    // チェックが0件なら全件表示、そうでないならチェックされている種族のみ
    let isTargetCb = false;
    if (this.state.cond_checkedRaces.length === 0) {
      isTargetCb = true;
    } else {
      isTargetCb = this.state.cond_checkedRaces.indexOf(friend.race) !== -1;
    }
    return isTargetText && isTargetCb;
  }

  /** 
   * 画面描画のお友達リスト部分を描画します。内部メソッドです。
   * @returns {(JSX)} JSX形式のHTMLタグ部分
   */
  renderFriendsList() {
    // ES6のfilter関数は1件1件についてtrueなら新しい配列に追加する。
    // もしもフィルタ条件をこの関数内に関数オブジェクトとして定義した場合は、
    // thisの指す先が変わってしまうので引数で渡す必要がある。
    let filteredList = this.state.friendList.filter((friend) =>{
      return this.filterFunc(friend);
    });

    // コールバック関数をアロー関数で記述。変数friendの1件1件について処理して返す。
    // 返す内容がJSXなので、return (); の中に入れる必要がある。
    return filteredList.map((friend) => {
      return (
        <tr key={friend.name}>
          <td>{friend.name}</td>
          <td>{friend.race}</td>
        </tr>
      );
    });
  }

}

export default App;
