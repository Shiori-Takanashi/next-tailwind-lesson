#!/bin/bash

# データファイルが格納されているベースディレクトリ
BASE_DIR="../data"

# ★★★ 処理対象のサブディレクトリ名をここに直接記述します ★★★
SUB_DIRS=("monster" "pokemon" "species") # 必要に応じて他のディレクトリ名も追加・変更してください

# 1から10までの数字でループ
for i in {1..10}; do
  # 指定された各サブディレクトリでループ
  for dir in "${SUB_DIRS[@]}"; do
    # 対象となるファイルのフルパスを構築
    FILE_PATH="${BASE_DIR}/${dir}/${i}.json"

    # ファイルが実際に存在するか確認
    if [ -f "$FILE_PATH" ]; then
      echo "Gitインデックスから ${FILE_PATH} を削除します..."
      git rm --cached "$FILE_PATH"
    else
      echo "ファイル ${FILE_PATH} が見つかりません。スキップします。"
    fi
  done
done

echo "処理が完了しました。"
