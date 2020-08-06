import React, {Component} from 'react';
import './App.css';

/**
 * お友達一覧を表示するReactコンポーネントです。
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
    // コンストラクタでStateを初期化
    this.state = {
      friendList: [], // お友達リスト
      cond_races: [], // ユニークな種族名の配列
      cond_checkedRaces: [], // チェックされた種族名の配列
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
      {name: "シューちゃん", race: "猫"},
      {name: "ジェラトーニ", race: "猫"},
      {name: "クマたん", race: "熊"},
      {name: "クマすけ", race: "熊"},
      {name: "テディベア", race: "熊"},
      {name: "リボンのくまさん", race: "熊"},
      {name: "ハンさん", race: "ユニコーン"},
      {name: "ダンテさん", race: "ドラゴン"},
      {name: "スカイア", race: "ドラゴン"},
      {name: "きりんさん", race: "キリン"},
      {name: "あかねまる", race: "狐"},

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
    // ここにチェックボックスチェック時の処理が入る
    //console.log("** handleChangeMultiCb in.", e.target.checked, e.target.value);
    //console.dir(e);
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
    //console.log("** handleChangeMultiCb setState done.", checkedRaces);
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
   * チェックボックス部分を描画します。内部メソッドです。
   * @returns {(JSX)} JSX形式のHTMLタグ部分
   */
  renderCbs() {
    //console.log("** renderCbs() in.");
    // アロー関数のmapで書いていったらJSX以外の変数は掛けなかったので、普通のループで
    let checkBoxList = [];
    for (let i = 0; i < this.state.cond_races.length; i++) {
      let race = this.state.cond_races[i];
      // 配列にチェックボックス1件分のJSXを追加していく。
      // handleChangeMultiCbは handleChangeMultiCb()と書いてしまうと引数のeがとれなくなってエラーになる。
      checkBoxList.push(
        <li key={i} >
          <input 
            id={i}
            type='checkbox'
            value={race}
            checked={this.calcIsChecked(race)}
            onChange={this.handleChangeMultiCb}
          />
          {race}
        </li>
      );
    }

    return (
      <div>
        <p>種族で絞り込むよ</p>
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
    return (
      <React.Fragment>
        <h1>お友達の一覧表示 with React</h1>
        {this.renderCbs()}
        <table border="1">
          <thead>
            <tr>
              <td width="200">なまえ</td>
              <td width="200">種族</td>
            </tr>
          </thead>
          <tbody>
            {this.renderFriendsList()}
          </tbody>
        </table>
      </React.Fragment>
    );
  }

  /** 
   * 画面描画のお友達リスト部分を描画します。内部メソッドです。
   * @returns {(JSX)} JSX形式のHTMLタグ部分
   */
  renderFriendsList() {
    // ES6のfilter関数は1件についてtrueなら新しい配列に追加
    let filteredList = this.state.friendList.filter((friend) =>{
      // チェックが0件なら全件表示、そうでないならチェックされている種族のみ
      if (this.state.cond_checkedRaces.length === 0) {
        return true;
      }
      return this.state.cond_checkedRaces.indexOf(friend.race) !== -1;
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
