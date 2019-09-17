rm -rf ./build-preview && cd ./packages &&
for d in  **/*dist*/; do
	mkdir -p "../build-preview/${d//"/dist"/}" &&
	cp -r "./$d/." "../build-preview/${d//"/dist"/}"
done
